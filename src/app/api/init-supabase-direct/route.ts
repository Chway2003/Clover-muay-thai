import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DIRECT SUPABASE INIT START ===');
    
    // Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('timetable')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Supabase connection error:', testError);
      return NextResponse.json({
        error: 'Cannot connect to Supabase',
        details: testError.message
      }, { status: 500 });
    }
    
    console.log('Supabase connection successful');
    
    // Check current timetable data
    const { data: existingTimetable, error: timetableError } = await supabase
      .from('timetable')
      .select('*');
    
    if (timetableError) {
      console.error('Error fetching timetable:', timetableError);
      return NextResponse.json({
        error: 'Error fetching timetable',
        details: timetableError.message
      }, { status: 500 });
    }
    
    console.log('Current timetable count:', existingTimetable?.length || 0);
    
    // If no timetable data, create it
    if (!existingTimetable || existingTimetable.length === 0) {
      console.log('Creating default timetable data...');
      
      const defaultTimetable = [
        {
          id: "mon-630",
          day: "Monday",
          time: "18:30",
          end_time: "19:30",
          class_type: "Beginner Muay Thai",
          max_spots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        },
        {
          id: "mon-745",
          day: "Monday",
          time: "19:45",
          end_time: "20:45",
          class_type: "Intermediate Training",
          max_spots: 8,
          description: "Build on fundamentals with advanced combinations and sparring drills."
        },
        {
          id: "tue-630",
          day: "Tuesday",
          time: "18:30",
          end_time: "19:30",
          class_type: "Beginner Muay Thai",
          max_spots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        },
        {
          id: "tue-745",
          day: "Tuesday",
          time: "19:45",
          end_time: "20:45",
          class_type: "Intermediate Training",
          max_spots: 8,
          description: "Build on fundamentals with advanced combinations and sparring drills."
        },
        {
          id: "wed-630",
          day: "Wednesday",
          time: "18:30",
          end_time: "19:30",
          class_type: "Beginner Muay Thai",
          max_spots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        },
        {
          id: "wed-745",
          day: "Wednesday",
          time: "19:45",
          end_time: "20:45",
          class_type: "Intermediate Training",
          max_spots: 8,
          description: "Build on fundamentals with advanced combinations and sparring drills."
        },
        {
          id: "thu-630",
          day: "Thursday",
          time: "18:30",
          end_time: "19:30",
          class_type: "Beginner Muay Thai",
          max_spots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        },
        {
          id: "thu-745",
          day: "Thursday",
          time: "19:45",
          end_time: "20:45",
          class_type: "Intermediate Training",
          max_spots: 8,
          description: "Build on fundamentals with advanced combinations and sparring drills."
        },
        {
          id: "fri-630",
          day: "Friday",
          time: "18:30",
          end_time: "19:30",
          class_type: "Beginner Muay Thai",
          max_spots: 8,
          description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
        }
      ];
      
      const { data: insertData, error: insertError } = await supabase
        .from('timetable')
        .insert(defaultTimetable)
        .select();
      
      if (insertError) {
        console.error('Error inserting timetable:', insertError);
        return NextResponse.json({
          error: 'Error inserting timetable data',
          details: insertError.message
        }, { status: 500 });
      }
      
      console.log('Timetable data inserted successfully:', insertData?.length || 0, 'classes');
    } else {
      console.log('Timetable data already exists');
    }
    
    // Get final data
    const { data: finalTimetable, error: finalTimetableError } = await supabase
      .from('timetable')
      .select('*');
    
    const { data: finalBookings, error: finalBookingsError } = await supabase
      .from('bookings')
      .select('*');
    
    const { data: finalUsers, error: finalUsersError } = await supabase
      .from('users')
      .select('*');
    
    console.log('=== DIRECT SUPABASE INIT END ===');
    
    return NextResponse.json({
      message: 'Direct Supabase initialization completed',
      data: {
        timetableCount: finalTimetable?.length || 0,
        bookingsCount: finalBookings?.length || 0,
        usersCount: finalUsers?.length || 0
      },
      timetable: finalTimetable || [],
      bookings: finalBookings || [],
      users: finalUsers || []
    });
    
  } catch (error) {
    console.error('Direct Supabase init error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: `Direct Supabase init failed: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
