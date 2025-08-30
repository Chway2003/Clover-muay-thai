import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export async function POST(request: NextRequest) {
  try {
    console.log('Setting up timetable data...');
    
    // Initialize default data if needed
    await DataService.initializeDefaultData();
    
    // Get current timetable
    const timetable = await DataService.getTimetable();
    
    console.log('Timetable setup complete:', { count: timetable.length });
    
    return NextResponse.json({
      message: 'Timetable setup complete',
      timetableCount: timetable.length,
      timetable
    });
  } catch (error) {
    console.error('Error setting up timetable:', error);
    return NextResponse.json(
      { error: 'Failed to setup timetable' },
      { status: 500 }
    );
  }
}
