import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug Data API called');
    
    // Get all data
    const users = await DataService.getUsers();
    const bookings = await DataService.getBookings();
    const timetable = await DataService.getTimetable();
    
    console.log('📊 Data Summary:', {
      usersCount: users.length,
      bookingsCount: bookings.length,
      timetableCount: timetable.length
    });
    
    return NextResponse.json({
      message: 'Debug data retrieved',
      data: {
                 users: {
           count: users.length,
           users: users.map((u: any) => ({
             id: u.id,
             email: u.email,
             name: u.name,
             isAdmin: u.isAdmin
           }))
         },
         bookings: {
           count: bookings.length,
           bookings: bookings.map((b: any) => ({
             id: b.id,
             userId: b.userId,
             userName: b.userName,
             classId: b.classId,
             date: b.date,
             createdAt: b.createdAt
           }))
         },
         timetable: {
           count: timetable.length,
           classes: timetable.map((c: any) => ({
             id: c.id,
             day: c.day,
             time: c.time,
             classType: c.classType,
             maxSpots: c.maxSpots
           }))
         }
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production',
        hasKvUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN,
        hasRedisUrl: !!process.env.REDIS_URL
      }
    });
    
  } catch (error) {
    console.error('❌ Debug data error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get debug data', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
