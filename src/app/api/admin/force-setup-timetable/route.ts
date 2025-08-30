import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export async function POST(request: NextRequest) {
  try {
    console.log('Force setting up timetable data...');
    
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
    
    // Force save the timetable
    await DataService.saveTimetable(defaultTimetable);
    
    // Verify it was saved
    const savedTimetable = await DataService.getTimetable();
    
    console.log('Force timetable setup complete:', { count: savedTimetable.length });
    
    return NextResponse.json({
      message: 'Timetable force setup complete',
      timetableCount: savedTimetable.length,
      timetable: savedTimetable
    });
  } catch (error) {
    console.error('Error force setting up timetable:', error);
    return NextResponse.json(
      { error: 'Failed to force setup timetable' },
      { status: 500 }
    );
  }
}
