import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper function to check admin access
const checkAdminAccess = async (request: NextRequest): Promise<boolean> => {
  try {
    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not available');
      return false;
    }

    // Dynamically import Supabase client only when needed
    const { supabase } = await import('@/lib/supabaseClient');
    
    // Get the authorization header
    let token = request.headers.get('authorization');
    
    if (token && token.startsWith('Bearer ')) {
      token = token.substring(7);
    }
    
    // Also check for access token in cookies
    const accessToken = request.cookies.get('sb-access-token')?.value;
    if (!token && accessToken) {
      token = accessToken;
    }
    
    if (!token) {
      return false;
    }

    // Verify the session with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return false;
    }

    // Check if user has admin privileges
    return user.user_metadata?.isAdmin || false;
  } catch (error) {
    console.error('Admin access check error:', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const isAdmin = await checkAdminAccess(request);
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Creating test booking...');
    
    // Get timetable to find a valid class
    const timetable = await DataService.getTimetable();
    if (timetable.length === 0) {
      return NextResponse.json({ error: 'No classes available' }, { status: 400 });
    }
    
    const testClass = timetable[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const testDate = tomorrow.toISOString();
    
    // Create test booking
    const testBooking = {
      id: 'test-booking-' + Date.now(),
      userId: 'test-user-' + Date.now(),
      userName: 'Test User',
      classId: testClass.id,
      className: testClass.classType,
      day: testClass.day,
      time: testClass.time,
      endTime: testClass.endTime,
      date: testDate,
      createdAt: new Date().toISOString()
    };
    
    // Save the test booking
    const success = await DataService.addBooking(testBooking);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to save test booking' }, { status: 500 });
    }
    
    // Verify the booking was saved
    const allBookings = await DataService.getBookings();
    
    console.log('Test booking created successfully:', {
      bookingId: testBooking.id,
      totalBookings: allBookings.length
    });
    
    return NextResponse.json({
      message: 'Test booking created successfully',
      booking: testBooking,
      totalBookings: allBookings.length
    });
    
  } catch (error) {
    console.error('Test booking creation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Test booking creation failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
