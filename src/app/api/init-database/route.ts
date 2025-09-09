import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DATABASE INIT START ===');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Supabase environment variables not configured',
        supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
        supabaseKey: supabaseKey ? 'SET' : 'NOT SET'
      }, { status: 500 });
    }
    
    // Create the default timetable data
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
    
    // Try to insert data using fetch to Supabase REST API
    const insertPromises = defaultTimetable.map(async (classItem) => {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/timetable`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(classItem)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error inserting ${classItem.id}:`, response.status, errorText);
          return { id: classItem.id, success: false, error: errorText };
        }
        
        console.log(`Successfully inserted ${classItem.id}`);
        return { id: classItem.id, success: true };
      } catch (error) {
        console.error(`Error inserting ${classItem.id}:`, error);
        return { id: classItem.id, success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
    
    const results = await Promise.all(insertPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`Insert results: ${successful} successful, ${failed} failed`);
    
    // Try to fetch the data back to verify
    let verificationData = null;
    try {
      const verifyResponse = await fetch(`${supabaseUrl}/rest/v1/timetable?select=*`, {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        }
      });
      
      if (verifyResponse.ok) {
        verificationData = await verifyResponse.json();
      }
    } catch (error) {
      console.error('Error verifying data:', error);
    }
    
    console.log('=== DATABASE INIT END ===');
    
    return NextResponse.json({
      message: 'Database initialization completed',
      environment: {
        supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
        supabaseKey: supabaseKey ? 'SET' : 'NOT SET'
      },
      results: {
        total: results.length,
        successful,
        failed,
        details: results
      },
      verification: {
        timetableCount: verificationData?.length || 0,
        timetable: verificationData || []
      }
    });
    
  } catch (error) {
    console.error('Database init error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: `Database init failed: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
