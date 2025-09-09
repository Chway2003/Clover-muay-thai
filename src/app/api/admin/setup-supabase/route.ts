import { NextRequest, NextResponse } from 'next/server';
import { SupabaseDataService } from '@/lib/supabaseDataService';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper function to check admin access
const checkAdminAccess = async (request: NextRequest): Promise<boolean> => {
  try {
    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not available, allowing admin access for local development');
      return true;
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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return true;
    }
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

    console.log('=== SUPABASE SETUP START ===');
    
    // Check environment
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const hasSupabaseConfig = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    console.log('Environment check:', { isProduction, hasSupabaseConfig });
    
    if (!hasSupabaseConfig) {
      return NextResponse.json({
        error: 'Supabase not configured',
        environment: { isProduction, hasSupabaseConfig }
      }, { status: 400 });
    }
    
    // Test Supabase connection
    console.log('Testing Supabase connection...');
    const timetable = await SupabaseDataService.getTimetable();
    const bookings = await SupabaseDataService.getBookings();
    const users = await SupabaseDataService.getUsers();
    
    console.log('Supabase data loaded:', {
      timetableCount: timetable.length,
      bookingsCount: bookings.length,
      usersCount: users.length
    });
    
    // Initialize default data
    console.log('Initializing default data...');
    await SupabaseDataService.initializeDefaultData();
    
    // Test creating a booking
    console.log('Testing booking creation...');
    const testBooking = {
      id: 'supabase-test-' + Date.now(),
      userId: 'test-user',
      userName: 'Supabase Test User',
      classId: 'mon-630',
      className: 'Test Class',
      day: 'Monday',
      time: '18:30',
      endTime: '19:30',
      instructor: 'Test Instructor',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const addResult = await SupabaseDataService.addBooking(testBooking);
    console.log('Test booking add result:', addResult);
    
    // Verify the booking was saved
    const finalBookings = await SupabaseDataService.getBookings();
    console.log('Final bookings count:', finalBookings.length);
    
    console.log('=== SUPABASE SETUP END ===');
    
    return NextResponse.json({
      message: 'Supabase setup completed successfully',
      environment: { isProduction, hasSupabaseConfig },
      data: {
        timetableCount: timetable.length,
        bookingsCount: finalBookings.length,
        usersCount: users.length,
        testBookingAdded: addResult
      },
      sampleData: {
        timetable: timetable.slice(0, 2),
        bookings: finalBookings.slice(-2),
        users: users.slice(0, 2)
      }
    });
    
  } catch (error) {
    console.error('Supabase setup error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: `Supabase setup failed: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
