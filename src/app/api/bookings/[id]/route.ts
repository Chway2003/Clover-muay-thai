import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

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

    const success = await DataService.removeBooking(params.id, userId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Booking cancelled successfully'
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

    const bookings = await DataService.getBookings();
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
    await DataService.saveBookings(bookings);

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
