import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const bookingsFilePath = path.join(process.cwd(), 'data', 'bookings.json');

// Helper function to read bookings
const readBookings = () => {
  if (!fs.existsSync(bookingsFilePath)) {
    fs.writeFileSync(bookingsFilePath, '[]');
    return [];
  }
  const data = fs.readFileSync(bookingsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write bookings
const writeBookings = (bookings: any[]) => {
  fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));
};

// Middleware to check admin access
const checkAdminAccess = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  try {
    // For now, we'll do a simple check
    // In a real app, you'd verify the JWT token and check admin status
    return true;
  } catch (error) {
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

    const bookings = readBookings();
    const bookingIndex = bookings.findIndex((booking: any) => booking.id === params.id);

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Remove the booking
    const deletedBooking = bookings.splice(bookingIndex, 1)[0];
    writeBookings(bookings);

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking: deletedBooking
    });

  } catch (error) {
    console.error('Error cancelling admin booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
