import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== FORCE INIT START ===');
    
    // Check environment
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const hasSupabaseConfig = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    console.log('Environment check:', { isProduction, hasSupabaseConfig });
    
    // Force initialize all data
    console.log('Force initializing all data...');
    await DataService.initializeDefaultData();
    
    // Get current data
    const timetable = await DataService.getTimetable();
    const bookings = await DataService.getBookings();
    const users = await DataService.getUsers();
    
    console.log('Data loaded:', {
      timetableCount: timetable.length,
      bookingsCount: bookings.length,
      usersCount: users.length
    });
    
    // If no timetable data, create some
    if (timetable.length === 0) {
      console.log('No timetable data found, creating default...');
      const defaultTimetable = [
        {
          id: "mon-630",
          day: "Monday",
          time: "18:30",
          endTime: "19:30",
          classType: "Beginner Muay Thai",
          maxSpots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        },
        {
          id: "tue-630",
          day: "Tuesday",
          time: "18:30",
          endTime: "19:30",
          classType: "Beginner Muay Thai",
          maxSpots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        },
        {
          id: "wed-630",
          day: "Wednesday",
          time: "18:30",
          endTime: "19:30",
          classType: "Beginner Muay Thai",
          maxSpots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        },
        {
          id: "thu-630",
          day: "Thursday",
          time: "18:30",
          endTime: "19:30",
          classType: "Beginner Muay Thai",
          maxSpots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        },
        {
          id: "fri-630",
          day: "Friday",
          time: "18:30",
          endTime: "19:30",
          classType: "Beginner Muay Thai",
          maxSpots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        }
      ];
      
      for (const classItem of defaultTimetable) {
        await DataService.addClass(classItem);
      }
      
      console.log('Default timetable created');
    }
    
    // Get final data
    const finalTimetable = await DataService.getTimetable();
    const finalBookings = await DataService.getBookings();
    
    console.log('=== FORCE INIT END ===');
    
    return NextResponse.json({
      message: 'Force initialization completed',
      environment: { isProduction, hasSupabaseConfig },
      data: {
        timetableCount: finalTimetable.length,
        bookingsCount: finalBookings.length,
        usersCount: users.length
      },
      timetable: finalTimetable,
      bookings: finalBookings
    });
    
  } catch (error) {
    console.error('Force init error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: `Force init failed: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
