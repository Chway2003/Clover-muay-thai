'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ClassItem {
  id: string;
  day: string;
  time: string;
  endTime: string;
  classType: string;
  instructor: string;
  maxSpots: number;
  description: string;
  currentBookings: number;
  availableSpots: number;
  isFull: boolean;
}

interface Booking {
  id: string;
  userId: string;
  userName: string;
  classId: string;
  className: string;
  day: string;
  time: string;
  endTime: string;
  instructor: string;
  date: string;
  createdAt: string;
}

export default function BookingPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, 1 = next week, -1 = previous week
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Load timetable and bookings data
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Debug effect to log when data changes
  useEffect(() => {
    console.log('Bookings state changed:', bookings);
    console.log('Classes state changed:', classes);
  }, [bookings, classes]);

  // Debug effect to log when user changes
  useEffect(() => {
    console.log('User state changed:', user);
    console.log('User ID:', user?.id);
    console.log('User name:', user?.name);
    console.log('Is loading:', isLoading);
  }, [user, isLoading]);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      
      const response = await fetch('/api/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes || []);
        setBookings(data.bookings || []);
      } else {
        console.error('Failed to load data:', response.status);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleBookingNew = async (classId: string) => {
    console.log('🎯 NEW BOOKING FUNCTION CALLED with classId:', classId);
    
    if (!selectedDate) {
      setBookingStatus({
        type: 'error',
        message: 'Please select a date first'
      });
      return;
    }



    if (!user?.id || !user?.name) {
      setBookingStatus({
        type: 'error',
        message: 'User not properly authenticated. Please log in again.'
      });
      return;
    }

    // Prevent admin users from booking classes
    if (user?.isAdmin) {
      setBookingStatus({
        type: 'error',
        message: 'Admin users cannot book classes. Please use a regular user account.'
      });
      return;
    }

    try {
      const requestBody = {
        userId: user?.id,
        userName: user?.name,
        classId,
        date: selectedDate
      };
      
      console.log('Sending booking request:', requestBody);
      console.log('User object:', user);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        setBookingStatus({
          type: 'success',
          message: 'Class booked successfully!'
        });
        
        // Refresh data immediately
        await loadData();
        setSelectedDate(''); // Reset date selection
      } else {
        setBookingStatus({
          type: 'error',
          message: data.error || 'Failed to book class'
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingStatus({
        type: 'error',
        message: 'An error occurred while booking'
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}?userId=${user?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookingStatus({
          type: 'success',
          message: 'Booking cancelled successfully!'
        });
        
        // Immediately refresh data to ensure admin page sees the change
        await loadData();
        
        // Clear any selected date to refresh the class availability
        setSelectedDate('');
      } else {
        setBookingStatus({
          type: 'error',
          message: 'Failed to cancel booking'
        });
      }
    } catch (error) {
      setBookingStatus({
        type: 'error',
        message: 'An error occurred while cancelling'
      });
    }
  };

  const getUserBookings = () => {
    // Get all bookings for the current user, including past ones for display purposes
    const userBookings = bookings.filter(booking => 
      booking.userId === user?.id
    );
    
    // Sort by date (earliest first)
    return userBookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const formatTime = (time: string) => {
    return time.replace(':', '.');
  };

  const getWeekDates = (weekOffset: number = 0) => {
    const dates = [];
    const today = new Date();
    
    // Calculate the start of the week (Monday)
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(today.getDate() - daysFromMonday);
    
    // Calculate the start of the target week
    const targetWeekStart = new Date(mondayOfCurrentWeek);
    targetWeekStart.setDate(mondayOfCurrentWeek.getDate() + (weekOffset * 7));
    
    // Generate 7 days starting from Monday of the target week
    for (let i = 0; i < 7; i++) {
      const date = new Date(targetWeekStart);
      date.setDate(targetWeekStart.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getCurrentWeekLabel = () => {
    if (currentWeekOffset === 0) return 'This Week';
    if (currentWeekOffset === 1) return 'Next Week';
    if (currentWeekOffset === -1) return 'Last Week';
    if (currentWeekOffset > 1) return `Week of ${new Date(getWeekDates(currentWeekOffset)[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    if (currentWeekOffset < -1) return `Week of ${new Date(getWeekDates(currentWeekOffset)[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    return 'Week';
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-clover-green flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clover-green">
      <Header />
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
                     {/* Page Header */}
           <div className="text-center mb-12">
             <h1 className="text-4xl font-bold text-white mb-4">Book Your Classes</h1>
             <p className="text-clover-gold text-lg">Reserve your spot in our Muay Thai classes</p>
           </div>

          {/* Status Message */}
          {bookingStatus.type && (
            <div className={`mb-6 p-4 rounded-lg ${
              bookingStatus.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {bookingStatus.message}
            </div>
          )}

                     {/* Date Selection */}
           <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
             <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Date</h2>
             
             {/* Weekly Navigation */}
             <div className="flex items-center justify-between mb-6">
               <button
                 onClick={() => {
                   setCurrentWeekOffset(currentWeekOffset - 1);
                   setSelectedDate(''); // Clear selected date when changing weeks
                 }}
                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
               >
                 ← Previous Week
               </button>
               
               <div className="flex items-center space-x-4">
                 <div className="text-lg font-semibold text-gray-700">
                   {getCurrentWeekLabel()}
                 </div>
                 
                 {currentWeekOffset !== 0 && (
                   <button
                     onClick={() => {
                       setCurrentWeekOffset(0);
                       setSelectedDate(''); // Clear selected date when returning to current week
                     }}
                     className="px-3 py-1 bg-clover-gold text-clover-green text-sm rounded-lg hover:bg-yellow-400 transition-colors"
                   >
                     Today
                   </button>
                 )}
               </div>
               
               <button
                 onClick={() => {
                   setCurrentWeekOffset(currentWeekOffset + 1);
                   setSelectedDate(''); // Clear selected date when changing weeks
                 }}
                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
               >
                 Next Week →
               </button>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                               {getWeekDates(currentWeekOffset).map((date) => {
                  const dateObj = new Date(date);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = dateObj.getDate();
                  const isSelected = selectedDate === date;
                  const isDateInPast = dateObj < new Date();
                  
                  return (
                    <button
                      key={date}
                      onClick={() => !isDateInPast && setSelectedDate(date)}
                      disabled={isDateInPast}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-clover-gold bg-clover-gold text-white'
                          : isDateInPast
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-clover-gold hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-sm font-medium">{dayName}</div>
                      <div className="text-lg font-bold">{dayNum}</div>
                      {isDateInPast && (
                        <div className="text-xs text-gray-400 mt-1">Past</div>
                      )}
                    </button>
                  );
                })}
             </div>
           </div>

                                {/* Timetable - Only show after date selection */}
           {selectedDate && (
             <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
               <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Time Slots</h2>
               
               {/* Show admin message if user is admin */}
               {user?.isAdmin && (
                 <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                   <div className="text-yellow-800 text-center">
                     <div className="font-semibold mb-2">⚠️ Admin Access Detected</div>
                     <p>Admin users cannot book classes. This page is for regular users to book classes.</p>
                     <p className="text-sm mt-2">Use the <a href="/admin" className="underline font-medium">Admin Dashboard</a> to manage classes and bookings.</p>
                   </div>
                 </div>
               )}
               
               {isLoadingData ? (
                 <div className="text-center py-8">
                   <div className="text-gray-500">Loading time slots...</div>
                 </div>
               ) : (
                 <>
                   {/* Check if selected date is weekend */}
                   {(() => {
                     const selectedDateObj = new Date(selectedDate);
                     const dayOfWeek = selectedDateObj.getDay(); // 0 = Sunday, 6 = Saturday
                     
                     if (dayOfWeek === 0 || dayOfWeek === 6) {
                       return (
                         <div className="text-center py-12">
                           <div className="text-gray-500 text-lg mb-2">No available classes on this day</div>
                           <p className="text-sm text-gray-400">Please select a weekday (Monday - Friday)</p>
                         </div>
                       );
                     }
                     
                     return (
                       <div className="grid gap-4 md:grid-cols-2">
                         {classes
                           .filter((classItem) => {
                             // Get the day name for the selected date
                             const selectedDateObj = new Date(selectedDate);
                             const selectedDayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });
                             // Only show classes that match the selected day
                             return classItem.day === selectedDayName;
                           })
                           .map((classItem) => {
                                                       const isBooked = bookings.some(booking => {
                              const bookingDate = new Date(booking.date);
                              const selectedDateObj = new Date(selectedDate);
                              
                              return (
                                booking.userId === user?.id && 
                                booking.classId === classItem.id &&
                                bookingDate.toDateString() === selectedDateObj.toDateString()
                              );
                            });
                           
                                                       // Check if the selected date is in the past
                            const isDateInPast = new Date(selectedDate) < new Date();
                            
                            return (
                              <div key={classItem.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center">
                                <div className="mb-4">
                                  <div className="text-2xl font-bold text-gray-900 mb-2">
                                    {formatTime(classItem.time)} - {formatTime(classItem.endTime)}
                                  </div>
                                  <div className="text-sm text-gray-500">{classItem.day}</div>
                                </div>
                                
                                <div className="mb-4">
                                  <div className={`text-lg font-semibold ${
                                    classItem.availableSpots > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {classItem.availableSpots} / {classItem.maxSpots} spots available
                                  </div>
                                </div>
                                
                                                                 <button
                                   onClick={() => {
                                     console.log('Class item being booked:', classItem);
                                     console.log('Class ID being passed:', classItem.id);
                                     handleBookingNew(classItem.id);
                                   }}
                                   disabled={classItem.isFull || isBooked || isDateInPast || user?.isAdmin}
                                   className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                     user?.isAdmin
                                       ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                                       : isBooked
                                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                       : classItem.isFull
                                       ? 'bg-red-500 text-white cursor-not-allowed'
                                       : isDateInPast
                                       ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                                       : 'bg-clover-gold text-clover-green hover:bg-yellow-400'
                                   }`}
                                 >
                                   {user?.isAdmin ? 'Admin Cannot Book' : isBooked ? 'Already Booked' : classItem.isFull ? 'Class Full' : isDateInPast ? 'Date Passed' : 'Book Now'}
                                 </button>
                              </div>
                            );
                         })}
                       </div>
                     );
                   })()}
                 </>
               )}
             </div>
           )}

                     {/* My Bookings */}
                       <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Upcoming Bookings</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    User ID: {user?.id} | Total Bookings: {bookings.length}
                  </div>
                  <button
                    onClick={loadData}
                    className="px-4 py-2 bg-clover-gold text-clover-green rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                  >
                    Refresh
                  </button>
                </div>
              </div>
             
                           {isLoadingData ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading bookings...</div>
                </div>
              ) : getUserBookings().length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">No upcoming bookings</div>
                  <p className="text-sm text-gray-400 mt-2">Book a time slot above to get started!</p>
                </div>
              ) : (
               <div className="space-y-4">
                 {getUserBookings()
                   .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                   .map((booking) => (
                     <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                       <div className="flex justify-between items-center">
                         <div className="flex-1">
                           <div className="text-lg font-semibold text-gray-900 mb-1">
                             {formatTime(booking.time)} - {formatTime(booking.endTime)}
                           </div>
                           <div className="text-sm text-gray-600">
                             <div>{new Date(booking.date).toLocaleDateString('en-US', { 
                               weekday: 'long', 
                               month: 'long', 
                               day: 'numeric' 
                             })}</div>
                             <div>{booking.day}</div>
                           </div>
                         </div>
                         <button
                           onClick={() => handleCancelBooking(booking.id)}
                           className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                         >
                           Cancel
                         </button>
                       </div>
                     </div>
                   ))}
               </div>
             )}
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
