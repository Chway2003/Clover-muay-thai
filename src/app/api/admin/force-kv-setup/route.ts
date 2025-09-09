import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

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

    console.log('=== FORCE KV SETUP START ===');
    
    // Check environment
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    console.log('Environment:', { 
      NODE_ENV: process.env.NODE_ENV, 
      VERCEL: process.env.VERCEL,
      isProduction 
    });
    
    // Check KV configuration
    const hasKvConfig = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    console.log('KV Config:', { 
      hasKvConfig,
      hasUrl: !!process.env.KV_REST_API_URL,
      hasToken: !!process.env.KV_REST_API_TOKEN,
      url: process.env.KV_REST_API_URL
    });
    
    if (!isProduction) {
      return NextResponse.json({
        error: 'This endpoint only works in production',
        environment: { isProduction, hasKvConfig }
      }, { status: 400 });
    }
    
    if (!hasKvConfig) {
      return NextResponse.json({
        error: 'KV not configured in production',
        environment: { isProduction, hasKvConfig }
      }, { status: 400 });
    }
    
    // Initialize default data in KV
    console.log('Initializing data in KV...');
    await DataService.initializeDefaultData();
    
    // Test data persistence
    console.log('Testing data persistence...');
    
    // Create test booking
    const testBooking = {
      id: 'kv-test-' + Date.now(),
      userId: 'test-user',
      userName: 'KV Test User',
      classId: 'mon-630',
      className: 'Test Class',
      day: 'Monday',
      time: '18:30',
      endTime: '19:30',
      instructor: 'Test Instructor',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving test booking to KV...');
    const saveResult = await DataService.addBooking(testBooking);
    console.log('Save result:', saveResult);
    
    // Verify the booking was saved
    console.log('Verifying booking was saved...');
    const allBookings = await DataService.getBookings();
    console.log('Total bookings after save:', allBookings.length);
    
    // Test timetable
    const timetable = await DataService.getTimetable();
    console.log('Timetable count:', timetable.length);
    
    // Test users
    const users = await DataService.getUsers();
    console.log('Users count:', users.length);
    
    console.log('=== FORCE KV SETUP END ===');
    
    return NextResponse.json({
      message: 'KV setup completed successfully',
      environment: { isProduction, hasKvConfig },
      data: {
        timetableCount: timetable.length,
        bookingsCount: allBookings.length,
        usersCount: users.length,
        testBookingSaved: saveResult,
        testBooking: testBooking
      }
    });
    
  } catch (error) {
    console.error('Force KV setup error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: `Force KV setup failed: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
