import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const bookingsFilePath = path.join(process.cwd(), 'data', 'bookings.json');
const timetableFilePath = path.join(process.cwd(), 'data', 'timetable.json');

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

// Helper function to read timetable
const readTimetable = () => {
  const data = fs.readFileSync(timetableFilePath, 'utf-8');
  return JSON.parse(data);
};

export async function GET() {
  try {
    const bookings = readBookings();
    const timetable = readTimetable();
    
    // Calculate available spots for each class
    const classesWithAvailability = timetable.map((classItem: any) => {
      const classBookings = bookings.filter((booking: any) => 
        booking.classId === classItem.id && 
        new Date(booking.date) >= new Date()
      );
      
      return {
        ...classItem,
        currentBookings: classBookings.length,
        availableSpots: classItem.maxSpots - classBookings.length,
        isFull: classBookings.length >= classItem.maxSpots
      };
    });

    return NextResponse.json({
      classes: classesWithAvailability,
      bookings
    });
  } catch (error) {
    console.error('Error reading bookings:', error);
    return NextResponse.json(
      { error: 'Failed to read bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, classId, date } = await request.json();
    
    console.log('Booking request received:', { userId, userName, classId, date });

    if (!userId || !userName || !classId || !date) {
      console.log('Missing required fields:', { userId, userName, classId, date });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bookings = readBookings();
    const timetable = readTimetable();
    
    // Find the class
    const classItem = timetable.find((c: any) => c.id === classId);
    console.log('Looking for class with ID:', classId);
    console.log('Available classes:', timetable.map((c: any) => ({ id: c.id, day: c.day, time: c.time })));
    console.log('Found class:', classItem);
    
    if (!classItem) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if user already booked this class
    console.log('Checking for existing bookings...');
    console.log('Current user ID:', userId);
    console.log('Selected date:', date);
    console.log('Selected date object:', new Date(date));
    console.log('Selected date string:', new Date(date).toDateString());
    
    const existingBooking = bookings.find((booking: any) => 
      booking.userId === userId && 
      booking.classId === classId && 
      new Date(booking.date).toDateString() === new Date(date).toDateString()
    );
    
    console.log('Existing booking found:', existingBooking);

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already booked this class' },
        { status: 409 }
      );
    }

    // Check if class is full
    const classBookings = bookings.filter((booking: any) => 
      booking.classId === classId && 
      new Date(booking.date).toDateString() === new Date(date).toDateString()
    );

    if (classBookings.length >= classItem.maxSpots) {
      return NextResponse.json(
        { error: 'Class is full' },
        { status: 409 }
      );
    }

    // Create new booking
    const newBooking = {
      id: Date.now().toString(),
      userId,
      userName,
      classId,
      className: classItem.classType,
      day: classItem.day,
      time: classItem.time,
      endTime: classItem.endTime,
      instructor: classItem.instructor,
      date: new Date(date).toISOString(),
      createdAt: new Date().toISOString()
    };

    console.log('Creating new booking:', newBooking);
    console.log('Current bookings count:', bookings.length);

    bookings.push(newBooking);
    writeBookings(bookings);
    
    console.log('Booking saved successfully. New count:', bookings.length);

    return NextResponse.json({
      message: 'Booking successful',
      booking: newBooking
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
