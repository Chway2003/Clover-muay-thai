import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const timetableFilePath = path.join(process.cwd(), 'data', 'timetable.json');
const bookingsFilePath = path.join(process.cwd(), 'data', 'bookings.json');

// Helper function to read timetable
const readTimetable = () => {
  const data = fs.readFileSync(timetableFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write timetable
const writeTimetable = (timetable: any[]) => {
  fs.writeFileSync(timetableFilePath, JSON.stringify(timetable, null, 2));
};

// Helper function to read bookings
const readBookings = () => {
  if (!fs.existsSync(bookingsFilePath)) {
    fs.writeFileSync(bookingsFilePath, '[]');
    return [];
  }
  const data = fs.readFileSync(bookingsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write bookings
const writeBookings = (bookings: any[]) => {
  fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));
};

// Middleware to check admin access
const checkAdminAccess = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  try {
    // Verify JWT token and check admin status
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Check if user has admin privileges
    return decoded.isAdmin || false;
  } catch (error) {
    return false;
  }
};

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const isAdmin = await checkAdminAccess(request);
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timetable = readTimetable();
    const bookings = readBookings();
    
    console.log('Admin API: Timetable count:', timetable.length);
    console.log('Admin API: Bookings count:', bookings.length);
    console.log('Admin API: Sample booking:', bookings[0]);
    
    // Get upcoming dates (next 30 days)
    const upcomingDates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      upcomingDates.push(dateString);
    }

    // Create classes with booking information for each upcoming date
    const classesWithBookings = [];
    
    for (const date of upcomingDates) {
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      // Get classes for this day of the week
      const dayClasses = timetable.filter((classItem: any) => {
        const classDay = classItem.day.toLowerCase();
        const dateDay = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return classDay === dateDay;
      });

      for (const classItem of dayClasses) {
        // Get bookings for this specific class and date
        const classBookings = bookings.filter((booking: any) => 
          booking.classId === classItem.id && 
          new Date(booking.date).toDateString() === dateObj.toDateString()
        );

        classesWithBookings.push({
          id: `${classItem.id}-${date}`,
          classId: classItem.id,
          className: classItem.classType,
          day: classItem.day,
          date: date,
          time: classItem.time,
          endTime: classItem.endTime,
          instructor: classItem.instructor,
          maxSpots: classItem.maxSpots,
          currentBookings: classBookings.length,
          availableSpots: classItem.maxSpots - classBookings.length,
          isFull: classBookings.length >= classItem.maxSpots,
          bookings: classBookings.map((booking: any) => ({
            id: booking.id,
            userName: booking.userName,
            userEmail: `User ID: ${booking.userId}`,
            bookedAt: booking.createdAt
          }))
        });
      }
    }

    console.log('Admin API: Classes with bookings count:', classesWithBookings.length);
    console.log('Admin API: Sample class with bookings:', classesWithBookings[0]);
    
    // Create response with cache control headers
    const response = NextResponse.json({
      classes: classesWithBookings,
      timestamp: new Date().toISOString()
    });
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching admin classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const isAdmin = await checkAdminAccess(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { day, time, endTime, classType, instructor, maxSpots, description } = await request.json();

    if (!day || !time || !endTime || !classType || !instructor || !maxSpots) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const timetable = readTimetable();
    
    // Generate unique ID
    const id = `${day.toLowerCase().substring(0, 3)}-${time.replace(':', '')}`;
    
    // Check if class already exists
    const existingClass = timetable.find((c: any) => c.id === id);
    if (existingClass) {
      return NextResponse.json(
        { error: 'Class already exists for this day and time' },
        { status: 409 }
      );
    }

    const newClass = {
      id,
      day,
      time,
      endTime,
      classType,
      instructor,
      maxSpots: parseInt(maxSpots),
      description: description || ''
    };

    timetable.push(newClass);
    writeTimetable(timetable);

    return NextResponse.json({
      message: 'Class added successfully',
      class: newClass
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding class:', error);
    return NextResponse.json(
      { error: 'Failed to add class' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin access
    const isAdmin = await checkAdminAccess(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    if (!classId) {
      return NextResponse.json(
        { error: 'Class ID required' },
        { status: 400 }
      );
    }

    const timetable = readTimetable();
    const classIndex = timetable.findIndex((c: any) => c.id === classId);

    if (classIndex === -1) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Remove the class
    const deletedClass = timetable.splice(classIndex, 1)[0];
    writeTimetable(timetable);

    // Also remove any existing bookings for this class
    const bookings = readBookings();
    const updatedBookings = bookings.filter((booking: any) => booking.classId !== classId);
    writeBookings(updatedBookings);

    return NextResponse.json({
      message: 'Class removed successfully',
      class: deletedClass
    });

  } catch (error) {
    console.error('Error removing class:', error);
    return NextResponse.json(
      { error: 'Failed to remove class' },
      { status: 500 }
    );
  }
}
