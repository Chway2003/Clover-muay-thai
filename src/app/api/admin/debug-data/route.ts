import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export async function GET(request: NextRequest) {
  try {
    console.log('Debug data endpoint called');
    
    // Test each method individually
    const users = await DataService.getUsers();
    console.log('Users retrieved:', users.length);
    
    const bookings = await DataService.getBookings();
    console.log('Bookings retrieved:', bookings.length);
    
    const timetable = await DataService.getTimetable();
    console.log('Timetable retrieved:', timetable.length);
    
    // Check environment
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const hasKvUrl = !!process.env.KV_REST_API_URL;
    const hasKvToken = !!process.env.KV_REST_API_TOKEN;
    
    return NextResponse.json({
      isProduction,
      hasKvUrl,
      hasKvToken,
      users: {
        count: users.length,
        data: users
      },
      bookings: {
        count: bookings.length,
        data: bookings
      },
      timetable: {
        count: timetable.length,
        data: timetable
      }
    });
  } catch (error) {
    console.error('Debug data error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
