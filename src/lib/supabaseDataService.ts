import { supabase } from './supabaseClient';

// Supabase-based data service
export class SupabaseDataService {
  // Users
  static async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  static async saveUsers(users: any[]) {
    try {
      // This is a bit tricky with Supabase - we'll need to handle upserts
      // For now, we'll just log that this was called
      console.log('SupabaseDataService: saveUsers called with', users.length, 'users');
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  static async addUser(user: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select();

      if (error) {
        console.error('Error adding user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  }

  static async findUserByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error finding user by email:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async findUserById(id: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error finding user by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Bookings
  static async getBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting bookings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  }

  static async saveBookings(bookings: any[]) {
    try {
      // This is a bit tricky with Supabase - we'll need to handle upserts
      // For now, we'll just log that this was called
      console.log('SupabaseDataService: saveBookings called with', bookings.length, 'bookings');
      return true;
    } catch (error) {
      console.error('Error saving bookings:', error);
      return false;
    }
  }

  static async addBooking(booking: any) {
    try {
      console.log('Adding booking to Supabase:', { id: booking.id, userId: booking.userId, classId: booking.classId });
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          id: booking.id,
          user_id: booking.userId,
          user_name: booking.userName,
          class_id: booking.classId,
          class_name: booking.className,
          day: booking.day,
          time: booking.time,
          end_time: booking.endTime,
          date: booking.date,
          created_at: booking.createdAt
        }])
        .select();

      if (error) {
        console.error('Error adding booking:', error);
        return false;
      }

      console.log('Booking added successfully:', data);
      return true;
    } catch (error) {
      console.error('Error adding booking:', error);
      return false;
    }
  }

  static async removeBooking(bookingId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error removing booking:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing booking:', error);
      return false;
    }
  }

  // Timetable
  static async getTimetable() {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .select('*')
        .order('day', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error getting timetable:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting timetable:', error);
      return [];
    }
  }

  static async saveTimetable(timetable: any[]) {
    try {
      // This is a bit tricky with Supabase - we'll need to handle upserts
      // For now, we'll just log that this was called
      console.log('SupabaseDataService: saveTimetable called with', timetable.length, 'classes');
      return true;
    } catch (error) {
      console.error('Error saving timetable:', error);
      return false;
    }
  }

  static async addClass(classItem: any) {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .insert([{
          id: classItem.id,
          day: classItem.day,
          time: classItem.time,
          end_time: classItem.endTime,
          class_type: classItem.classType,
          max_spots: classItem.maxSpots,
          description: classItem.description
        }])
        .select();

      if (error) {
        console.error('Error adding class:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding class:', error);
      return false;
    }
  }

  static async removeClass(classId: string) {
    try {
      const { error } = await supabase
        .from('timetable')
        .delete()
        .eq('id', classId);

      if (error) {
        console.error('Error removing class:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing class:', error);
      return false;
    }
  }

  // Initialize default data
  static async initializeDefaultData() {
    try {
      console.log('Initializing default data in Supabase...');
      
      // Check if users exist
      const users = await this.getUsers();
      console.log('Current users:', { count: users.length });
      
      if (users.length === 0) {
        console.log('No users found, but this should be handled by Supabase auth');
      }

      // Check if timetable exists
      const timetable = await this.getTimetable();
      console.log('Current timetable:', { count: timetable.length });
      
      if (timetable.length === 0) {
        console.log('No timetable found, but this should be handled by the SQL schema');
      }

      // Check if bookings exist
      const bookings = await this.getBookings();
      console.log('Current bookings:', { count: bookings.length });

      console.log('Supabase data initialization complete');
    } catch (error) {
      console.error('Error initializing Supabase data:', error);
    }
  }
}
