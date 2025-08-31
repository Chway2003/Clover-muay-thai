import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { DataService } from '@/lib/dataService';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Middleware to check admin access
const checkAdminAccess = async (request: NextRequest) => {
  try {
    // Get the authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const accessToken = request.cookies.get('sb-access-token')?.value;
    
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (accessToken) {
      token = accessToken;
    }
    
    if (!token) {
      console.log('Admin Bookings API: No authorization token');
      return false;
    }

    // Verify the session with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('Admin Bookings API: Token verification failed:', error?.message);
      return false;
    }

    // Check if user has admin privileges
    const isAdmin = user.user_metadata?.isAdmin || false;
    console.log('Admin Bookings API: User is admin:', isAdmin);
    return isAdmin;
  } catch (error) {
    console.log('Admin Bookings API: Error checking admin access:', error);
    return false;
  }
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access
    const isAdmin = await checkAdminAccess(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await DataService.getBookings();
    const bookingIndex = bookings.findIndex((booking: any) => booking.id === params.id);

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Remove the booking
    const deletedBooking = bookings.splice(bookingIndex, 1)[0];
    await DataService.saveBookings(bookings);

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking: deletedBooking
    });

  } catch (error) {
    console.error('Error cancelling admin booking:', error);
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to cancel booking: ${errorMessage}` },
      { status: 500 }
    );
  }
}
