import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    console.log('Direct KV setup - setting up timetable data...');
    
    // Force create the default timetable data
    const defaultTimetable = [
      {
        id: "mon-630",
        day: "Monday",
        time: "18:30",
        endTime: "19:30",
        classType: "Beginner Muay Thai",
        instructor: "Coach John",
        maxSpots: 8,
        description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
      },
      {
        id: "mon-745",
        day: "Monday",
        time: "19:45",
        endTime: "20:45",
        classType: "Intermediate Training",
        instructor: "Coach John",
        maxSpots: 8,
        description: "Build on fundamentals with advanced combinations and sparring drills."
      },
      {
        id: "tue-630",
        day: "Tuesday",
        time: "18:30",
        endTime: "19:30",
        classType: "Beginner Muay Thai",
        instructor: "Coach Sarah",
        maxSpots: 8,
        description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
      },
      {
        id: "tue-745",
        day: "Tuesday",
        time: "19:45",
        endTime: "20:45",
        classType: "Intermediate Training",
        instructor: "Coach Sarah",
        maxSpots: 8,
        description: "Build on fundamentals with advanced combinations and sparring drills."
      },
      {
        id: "wed-630",
        day: "Wednesday",
        time: "18:30",
        endTime: "19:30",
        classType: "Beginner Muay Thai",
        instructor: "Coach John",
        maxSpots: 8,
        description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
      },
      {
        id: "wed-745",
        day: "Wednesday",
        time: "19:45",
        endTime: "20:45",
        classType: "Intermediate Training",
        instructor: "Coach John",
        maxSpots: 8,
        description: "Build on fundamentals with advanced combinations and sparring drills."
      },
      {
        id: "thu-630",
        day: "Thursday",
        time: "18:30",
        endTime: "19:30",
        classType: "Beginner Muay Thai",
        instructor: "Coach Sarah",
        maxSpots: 8,
        description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
      },
      {
        id: "thu-745",
        day: "Thursday",
        time: "19:45",
        endTime: "20:45",
        classType: "Intermediate Training",
        instructor: "Coach Sarah",
        maxSpots: 8,
        description: "Build on fundamentals with advanced combinations and sparring drills."
      },
      {
        id: "fri-630",
        day: "Friday",
        time: "18:30",
        endTime: "20:00",
        classType: "Sparring Session",
        instructor: "Coach John",
        maxSpots: 8,
        description: "Advanced sparring session for intermediate and advanced students."
      }
    ];
    
    // Directly save to Vercel KV
    console.log('Saving timetable directly to KV...');
    await kv.set('timetable', defaultTimetable);
    console.log('Timetable saved to KV successfully');
    
    // Verify it was saved by reading it back
    console.log('Reading timetable back from KV...');
    const savedTimetable = await kv.get('timetable');
    console.log('Retrieved timetable from KV:', { count: Array.isArray(savedTimetable) ? savedTimetable.length : 0 });
    
    return NextResponse.json({
      message: 'Direct KV timetable setup complete',
      timetableCount: Array.isArray(savedTimetable) ? savedTimetable.length : 0,
      timetable: savedTimetable,
      isProduction: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    });
  } catch (error) {
    console.error('Error in direct KV setup:', error);
    return NextResponse.json(
      { 
        error: 'Failed to setup timetable in KV',
        details: error instanceof Error ? error.message : 'Unknown error',
        isProduction: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
      },
      { status: 500 }
    );
  }
}
