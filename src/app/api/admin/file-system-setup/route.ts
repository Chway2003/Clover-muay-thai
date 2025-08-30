import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export async function POST(request: NextRequest) {
  try {
    console.log('File system setup - setting up timetable data...');
    
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
    
    // Save timetable using DataService
    console.log('Saving timetable using DataService...');
    await DataService.saveTimetable(defaultTimetable);
    console.log('Timetable saved successfully');
    
    // Verify it was saved by reading it back
    console.log('Reading timetable back...');
    const savedTimetable = await DataService.getTimetable();
    console.log('Retrieved timetable:', { count: savedTimetable.length });
    
    return NextResponse.json({
      message: 'Timetable setup complete using DataService',
      timetableCount: savedTimetable.length,
      timetable: savedTimetable,
      isProduction: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    });
  } catch (error) {
    console.error('Error in file system setup:', error);
    return NextResponse.json(
      { 
        error: 'Failed to setup timetable in file system',
        details: error instanceof Error ? error.message : 'Unknown error',
        isProduction: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
      },
      { status: 500 }
    );
  }
}
