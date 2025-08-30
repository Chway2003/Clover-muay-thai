import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export async function GET(request: NextRequest) {
  try {
    console.log('Checking data state...');
    
    const users = await DataService.getUsers();
    const bookings = await DataService.getBookings();
    const timetable = await DataService.getTimetable();
    
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    
    console.log('Data check complete:', { 
      isProduction,
      usersCount: users.length,
      bookingsCount: bookings.length,
      timetableCount: timetable.length
    });
    
    return NextResponse.json({
      isProduction,
      users: {
        count: users.length,
        sample: users[0] || null
      },
      bookings: {
        count: bookings.length,
        sample: bookings[0] || null
      },
      timetable: {
        count: timetable.length,
        sample: timetable[0] || null
      }
    });
  } catch (error) {
    console.error('Error checking data:', error);
    return NextResponse.json(
      { error: 'Failed to check data' },
      { status: 500 }
    );
  }
}
