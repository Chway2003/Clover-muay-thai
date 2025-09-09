import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export async function GET(request: NextRequest) {
  try {
    console.log('=== PRODUCTION DEBUG START ===');
    
    // Check environment
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    console.log('Environment:', { 
      NODE_ENV: process.env.NODE_ENV, 
      VERCEL: process.env.VERCEL,
      isProduction 
    });
    
    // Check KV configuration
    const hasKvConfig = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    console.log('KV Config:', { 
      hasKvConfig,
      hasUrl: !!process.env.KV_REST_API_URL,
      hasToken: !!process.env.KV_REST_API_TOKEN
    });
    
    // Test data loading
    console.log('Loading timetable...');
    const timetable = await DataService.getTimetable();
    console.log('Timetable loaded:', { count: timetable.length });
    
    console.log('Loading bookings...');
    const bookings = await DataService.getBookings();
    console.log('Bookings loaded:', { count: bookings.length });
    
    console.log('Loading users...');
    const users = await DataService.getUsers();
    console.log('Users loaded:', { count: users.length });
    
    // Test data saving
    console.log('Testing data persistence...');
    const testBooking = {
      id: 'test-' + Date.now(),
      userId: 'test-user',
      userName: 'Test User',
      classId: 'mon-630',
      className: 'Test Class',
      day: 'Monday',
      time: '18:30',
      endTime: '19:30',
      instructor: 'Test Instructor',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const saveResult = await DataService.addBooking(testBooking);
    console.log('Test booking save result:', saveResult);
    
    // Verify the booking was saved
    const updatedBookings = await DataService.getBookings();
    console.log('Updated bookings count:', updatedBookings.length);
    
    console.log('=== PRODUCTION DEBUG END ===');
    
    return NextResponse.json({
      environment: {
        isProduction,
        hasKvConfig,
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL
      },
      data: {
        timetableCount: timetable.length,
        bookingsCount: bookings.length,
        usersCount: users.length,
        updatedBookingsCount: updatedBookings.length,
        testBookingSaved: saveResult
      },
      sampleData: {
        timetable: timetable.slice(0, 2),
        bookings: updatedBookings.slice(-2),
        users: users.slice(0, 2)
      }
    });
    
  } catch (error) {
    console.error('Production debug error:', error);
    return NextResponse.json(
      { 
        error: 'Debug failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
