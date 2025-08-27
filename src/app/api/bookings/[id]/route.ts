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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const bookings = readBookings();
    const bookingIndex = bookings.findIndex((booking: any) => 
      booking.id === params.id && booking.userId === userId
    );

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
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
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, date } = await request.json();

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bookings = readBookings();
    const bookingIndex = bookings.findIndex((booking: any) => 
      booking.id === params.id && booking.userId === userId
    );

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update the booking date
    bookings[bookingIndex].date = new Date(date).toISOString();
    writeBookings(bookings);

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: bookings[bookingIndex]
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
