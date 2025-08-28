import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';
import { isDateBookable } from '@/lib/bookingUtils';



export async function GET() {
  try {
    console.log('GET /api/bookings called');
    
    // Initialize default data if needed
    await DataService.initializeDefaultData();
    
    const bookings = await DataService.getBookings();
    const timetable = await DataService.getTimetable();
    
    console.log('Data loaded:', { 
      bookingsCount: bookings.length, 
      timetableCount: timetable.length,
      timetableSample: timetable[0]
    });
    
    // Ensure we have arrays
    if (!Array.isArray(timetable) || !Array.isArray(bookings)) {
      console.error('Invalid data structure:', { timetable, bookings });
      return NextResponse.json(
        { error: 'Invalid data structure' },
        { status: 500 }
      );
    }
    
    // Calculate available spots for each class, filtering out past dates
    const classesWithAvailability = timetable.map((classItem: any) => {
      // Filter bookings to only include current and future dates
      const classBookings = bookings.filter((booking: any) => {
        return booking.classId === classItem.id && isDateBookable(booking.date);
      });
      
      return {
        ...classItem,
        currentBookings: classBookings.length,
        availableSpots: classItem.maxSpots - classBookings.length,
        isFull: classBookings.length >= classItem.maxSpots
      };
    });

    console.log('Classes with availability:', { 
      count: classesWithAvailability.length,
      sample: classesWithAvailability[0]
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
    const body = await request.json();
    console.log('Raw request body:', body);
    
    // Handle both field name variations
    const userId = body.userId || body.user;
    const userName = body.userName;
    const classId = body.classId;
    const date = body.date || body.selectedDate;
    
    console.log('Parsed fields:', { userId, userName, classId, date });

    if (!userId || !userName || !classId || !date) {
      console.log('Missing required fields:', { userId, userName, classId, date });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the date is bookable according to new rules
    if (!isDateBookable(date)) {
      return NextResponse.json(
        { error: 'Cannot book classes for past dates. You can only book for today or future dates.' },
        { status: 400 }
      );
    }

    const bookings = await DataService.getBookings();
    const timetable = await DataService.getTimetable();
    
    // Ensure we have arrays
    if (!Array.isArray(timetable) || !Array.isArray(bookings)) {
      console.error('Invalid data structure:', { timetable, bookings });
      return NextResponse.json(
        { error: 'Invalid data structure' },
        { status: 500 }
      );
    }
    
    // Find the class
    console.log('Looking for class with ID:', classId);
    console.log('Available classes in timetable:', timetable.map((c: any) => ({ id: c.id, day: c.day, time: c.time })));
    
    const classItem = timetable.find((c: any) => c.id === classId);
    console.log('Found class:', classItem);
    
    if (!classItem) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if user already booked this class
    const existingBooking = bookings.find((booking: any) => 
      booking.userId === userId && 
      booking.classId === classId && 
      new Date(booking.date).toDateString() === new Date(date).toDateString()
    );

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

    await DataService.addBooking(newBooking);

    return NextResponse.json({
      message: 'Booking successful',
      booking: newBooking
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    const errorName = error instanceof Error ? error.name : 'Unknown error type';
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    return NextResponse.json(
      { error: `Failed to create booking: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!bookingId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await DataService.removeBooking(bookingId, userId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to remove booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to cancel booking: ${errorMessage}` },
      { status: 500 }
    );
  }
}
