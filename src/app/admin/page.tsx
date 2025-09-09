'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AdminClass {
  id: string;
  classId: string;
  className: string;
  day: string;
  date: string;
  time: string;
  endTime: string;
  maxSpots: number;
  currentBookings: number;
  availableSpots: number;
  isFull: boolean;
  isRecurring?: boolean;
  bookings: {
    id: string;
    userName: string;
    userEmail: string;
    bookedAt: string;
  }[];
}

interface NewClassForm {
  day: string;
  time: string;
  endTime: string;
  classType: string;
  maxSpots: string;
  description: string;
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState<AdminClass[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [newClassForm, setNewClassForm] = useState<NewClassForm>({
    day: 'Monday',
    time: '18:30',
    endTime: '19:30',
    classType: '',
    maxSpots: '8',
    description: ''
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [refreshNotification, setRefreshNotification] = useState<string>('');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    } else if (!isLoading && user && !user.isAdmin) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Load admin data
  useEffect(() => {
    if (user?.isAdmin) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setIsLoadingData(true);
      
      const response = await fetch('/api/admin/classes');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.classes && Array.isArray(data.classes)) {
          setClasses(data.classes);
        } else {
          setClasses([]);
        }
        
        setLastRefreshTime(new Date());
        setRefreshNotification(`Data manually refreshed at ${new Date().toLocaleTimeString()}`);
        setTimeout(() => setRefreshNotification(''), 3000);
      } else {
        console.error('Failed to load admin data');
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setStatusMessage({
          type: 'success',
          message: 'Booking cancelled successfully!'
        });
        loadAdminData();
      } else {
        setStatusMessage({
          type: 'error',
          message: 'Failed to cancel booking'
        });
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: 'An error occurred while cancelling'
      });
    }
  };

  const handleRemoveClass = async (classId: string) => {
    if (!confirm('Are you sure you want to remove this class? This will also cancel all existing bookings.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/classes?classId=${classId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setStatusMessage({
          type: 'success',
          message: 'Class removed successfully!'
        });
        loadAdminData();
      } else {
        setStatusMessage({
          type: 'error',
          message: 'Failed to remove class'
        });
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: 'An error occurred while removing class'
      });
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newClassForm),
      });

      if (response.ok) {
        setStatusMessage({
          type: 'success',
          message: 'Class added successfully!'
        });
        setShowAddClassForm(false);
        setNewClassForm({
          day: 'Monday',
          time: '18:30',
          endTime: '19:30',
          classType: '',
          maxSpots: '8',
          description: ''
        });
        loadAdminData();
      } else {
        const data = await response.json();
        setStatusMessage({
          type: 'error',
          message: data.error || 'Failed to add class'
        });
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: 'An error occurred while adding class'
      });
    }
  };

  const formatTime = (time: string) => {
    return time.replace(':', '.');
  };

  const formatDate = (date: string) => {
    if (date === 'Recurring') return date;
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading || !user || !user.isAdmin) {
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
            <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-clover-gold text-lg">Manage classes and bookings</p>
          </div>

          {/* Status Message */}
          {statusMessage.type && (
            <div className={`mb-6 p-4 rounded-lg ${
              statusMessage.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {statusMessage.message}
            </div>
          )}

          {/* Refresh Notification */}
          {refreshNotification && (
            <div className="mb-6 p-3 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-center">
              {refreshNotification}
            </div>
          )}

          {/* Add Class Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowAddClassForm(!showAddClassForm)}
              className="bg-clover-gold text-clover-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              {showAddClassForm ? 'Cancel' : 'Add New Class'}
            </button>
          </div>

          {/* Add Class Form */}
          {showAddClassForm && (
            <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Class</h2>
              
              <form onSubmit={handleAddClass} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                  <select
                    value={newClassForm.day}
                    onChange={(e) => setNewClassForm({...newClassForm, day: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold"
                    required
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newClassForm.time}
                    onChange={(e) => setNewClassForm({...newClassForm, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={newClassForm.endTime}
                    onChange={(e) => setNewClassForm({...newClassForm, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Spots</label>
                  <input
                    type="number"
                    value={newClassForm.maxSpots}
                    onChange={(e) => setNewClassForm({...newClassForm, maxSpots: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold"
                    min="1"
                    max="20"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Type</label>
                  <input
                    type="text"
                    value={newClassForm.classType}
                    onChange={(e) => setNewClassForm({...newClassForm, classType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold"
                    placeholder="e.g., Beginner Muay Thai"
                    required
                  />
                </div>


                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newClassForm.description}
                    onChange={(e) => setNewClassForm({...newClassForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold"
                    rows={3}
                    placeholder="Class description..."
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-clover-gold text-clover-green py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Add Class
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Timetable Summary */}
          {classes.length > 0 && (
            <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Timetable Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                  const dayClasses = classes.filter((c: any) => c.day === day && c.isRecurring);
                  return (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{day}</h3>
                      {dayClasses.length > 0 ? (
                        <div className="space-y-2">
                          {dayClasses.map((classItem: any) => (
                            <div key={classItem.id} className="text-sm">
                              <div className="font-medium text-gray-700">{classItem.className}</div>
                              <div className="text-gray-500">{classItem.time} - {classItem.endTime}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">No classes scheduled</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Classes Table */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Classes & Bookings</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Last updated: {lastRefreshTime.toLocaleTimeString()}
                </div>
                <button
                  onClick={loadAdminData}
                  className="px-4 py-2 bg-clover-gold text-clover-green rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                >
                  Refresh Now
                </button>
              </div>
            </div>
            
            {isLoadingData ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading classes...</div>
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No classes found</div>
                <p className="text-sm text-gray-400 mt-2">Try refreshing the data or add new classes</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-900">Class</th>
                      <th className="px-4 py-3 font-semibold text-gray-900">Day/Date</th>
                      <th className="px-4 py-3 font-semibold text-gray-900">Time</th>
                      <th className="px-4 py-3 font-semibold text-gray-900">Spots</th>
                      <th className="px-4 py-3 font-semibold text-gray-900">Bookings</th>
                      <th className="px-4 py-3 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {classes.map((classItem) => (
                      <tr key={classItem.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{classItem.className}</div>
                            {classItem.isRecurring && (
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Recurring
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-900">
                          {classItem.isRecurring ? classItem.day : formatDate(classItem.date)}
                        </td>
                        <td className="px-4 py-4 text-gray-900">
                          {formatTime(classItem.time)} - {formatTime(classItem.endTime)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {classItem.currentBookings} / {classItem.maxSpots} spots
                            </div>
                            <div className="text-gray-500">
                              {classItem.availableSpots} available
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {classItem.bookings.length > 0 ? (
                            <div className="text-sm space-y-1">
                              {classItem.bookings.map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between text-xs text-gray-600">
                                  <span>{booking.userName}</span>
                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="text-red-600 hover:text-red-800 ml-2"
                                    title="Cancel this booking"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No bookings</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleRemoveClass(classItem.classId)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            title="Remove this class"
                          >
                            Remove Class
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
