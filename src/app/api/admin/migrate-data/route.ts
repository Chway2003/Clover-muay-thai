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

    console.log('Starting data migration...');
    
    // Initialize default data
    await DataService.initializeDefaultData();
    
    // Get current data
    const timetable = await DataService.getTimetable();
    const bookings = await DataService.getBookings();
    const users = await DataService.getUsers();
    
    console.log('Migration complete:', {
      timetableCount: timetable.length,
      bookingsCount: bookings.length,
      usersCount: users.length
    });
    
    return NextResponse.json({
      message: 'Data migration completed successfully',
      data: {
        timetableCount: timetable.length,
        bookingsCount: bookings.length,
        usersCount: users.length
      }
    });
    
  } catch (error) {
    console.error('Data migration error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Data migration failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
