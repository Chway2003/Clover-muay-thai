import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DataService } from '@/lib/dataService';

// Middleware to check admin access
const checkAdminAccess = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Admin Bookings API: No authorization header');
    return false;
  }
  
  const token = authHeader.substring(7);
  try {
    // Verify JWT token and check admin status
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('Admin Bookings API: Decoded token:', decoded);
    
    // Check if user has admin privileges
    if (decoded.isAdmin) {
      console.log('Admin Bookings API: User is admin');
      return true;
    } else {
      console.log('Admin Bookings API: User is not admin');
      return false;
    }
  } catch (error) {
    console.log('Admin Bookings API: Token verification failed:', error);
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
