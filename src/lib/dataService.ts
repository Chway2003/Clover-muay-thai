import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

// Data service using Vercel KV on production, file system locally
export class DataService {
  private static isProduction() {
    return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  }

  private static getFilePath(filename: string) {
    return path.join(process.cwd(), 'data', filename);
  }
  // Users
  static async getUsers() {
    try {
      if (this.isProduction()) {
        const users = await kv.get('users');
        return Array.isArray(users) ? users : [];
      } else {
        // Local file system fallback
        const filePath = this.getFilePath('users.json');
        if (!fs.existsSync(filePath)) {
          return [];
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  static async saveUsers(users: any[]) {
    try {
      if (this.isProduction()) {
        await kv.set('users', users);
      } else {
        // Local file system fallback
        const filePath = this.getFilePath('users.json');
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
      }
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  static async addUser(user: any) {
    try {
      const users = await this.getUsers();
      users.push(user);
      await this.saveUsers(users);
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  }

  static async findUserByEmail(email: string) {
    try {
      const users = await this.getUsers();
      return users.find((u: any) => u.email === email);
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async findUserById(id: string) {
    try {
      const users = await this.getUsers();
      return users.find((u: any) => u.id === id);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Bookings
  static async getBookings() {
    try {
      if (this.isProduction()) {
        const bookings = await kv.get('bookings');
        return Array.isArray(bookings) ? bookings : [];
      } else {
        // Local file system fallback
        const filePath = this.getFilePath('bookings.json');
        if (!fs.existsSync(filePath)) {
          return [];
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  }

  static async saveBookings(bookings: any[]) {
    try {
      if (this.isProduction()) {
        await kv.set('bookings', bookings);
      } else {
        // Local file system fallback
        const filePath = this.getFilePath('bookings.json');
        fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2));
      }
      return true;
    } catch (error) {
      console.error('Error saving bookings:', error);
      return false;
    }
  }

  static async addBooking(booking: any) {
    try {
      const bookings = await this.getBookings();
      bookings.push(booking);
      await this.saveBookings(bookings);
      return true;
    } catch (error) {
      console.error('Error adding booking:', error);
      return false;
    }
  }

  static async removeBooking(bookingId: string, userId: string) {
    try {
      const bookings = await this.getBookings();
      const updatedBookings = bookings.filter((b: any) => !(b.id === bookingId && b.userId === userId));
      await this.saveBookings(updatedBookings);
      return true;
    } catch (error) {
      console.error('Error removing booking:', error);
      return false;
    }
  }

  // Timetable
  static async getTimetable() {
    try {
      if (this.isProduction()) {
        const timetable = await kv.get('timetable');
        return Array.isArray(timetable) ? timetable : [];
      } else {
        // Local file system fallback
        const filePath = this.getFilePath('timetable.json');
        if (!fs.existsSync(filePath)) {
          return [];
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error getting timetable:', error);
      return [];
    }
  }

  static async saveTimetable(timetable: any[]) {
    try {
      if (this.isProduction()) {
        await kv.set('timetable', timetable);
      } else {
        // Local file system fallback
        const filePath = this.getFilePath('timetable.json');
        fs.writeFileSync(filePath, JSON.stringify(timetable, null, 2));
      }
      return true;
    } catch (error) {
      console.error('Error saving timetable:', error);
      return false;
    }
  }

  static async addClass(classItem: any) {
    try {
      const timetable = await this.getTimetable();
      timetable.push(classItem);
      await this.saveTimetable(timetable);
      return true;
    } catch (error) {
      console.error('Error adding class:', error);
      return false;
    }
  }

  static async removeClass(classId: string) {
    try {
      const timetable = await this.getTimetable();
      const updatedTimetable = timetable.filter((c: any) => c.id !== classId);
      await this.saveTimetable(updatedTimetable);
      return true;
    } catch (error) {
      console.error('Error removing class:', error);
      return false;
    }
  }

  // Initialize default data if empty
  static async initializeDefaultData() {
    try {
      // Check if users exist
      const users = await this.getUsers();
      if (users.length === 0) {
        console.log('Initializing default users...');
        const defaultUsers = [
          {
            id: '1756320631381',
            email: 'clovermuaythai@gmail.com',
            name: 'admin',
            password: '$2b$10$fPZBkNmSfKAEKnU63SOgku1nSUHsa8TY4ytLTv8QdCJBVUo71g4y6',
            isAdmin: true,
            createdAt: new Date().toISOString()
          }
        ];
        await this.saveUsers(defaultUsers);
      }

      // Check if timetable exists
      const timetable = await this.getTimetable();
      if (timetable.length === 0) {
        console.log('Initializing default timetable...');
        const defaultTimetable = [
          {
            id: "mon-630",
            day: "Monday",
            time: "18:30",
            endTime: "19:30",
            classType: "Beginner Muay Thai",
            instructor: "Coach John",
            maxSpots: 8,
            description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
          },
          {
            id: "mon-745",
            day: "Monday",
            time: "19:45",
            endTime: "20:45",
            classType: "Intermediate Training",
            instructor: "Coach John",
            maxSpots: 8,
            description: "Build on fundamentals with advanced combinations and sparring drills."
          },
          {
            id: "tue-630",
            day: "Tuesday",
            time: "18:30",
            endTime: "19:30",
            classType: "Beginner Muay Thai",
            instructor: "Coach Sarah",
            maxSpots: 8,
            description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
          },
          {
            id: "tue-745",
            day: "Tuesday",
            time: "19:45",
            endTime: "20:45",
            classType: "Intermediate Training",
            instructor: "Coach Sarah",
            maxSpots: 8,
            description: "Build on fundamentals with advanced combinations and sparring drills."
          },
          {
            id: "wed-630",
            day: "Wednesday",
            time: "18:30",
            endTime: "19:30",
            classType: "Beginner Muay Thai",
            instructor: "Coach John",
            maxSpots: 8,
            description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
          },
          {
            id: "wed-745",
            day: "Wednesday",
            time: "19:45",
            endTime: "20:45",
            classType: "Intermediate Training",
            instructor: "Coach John",
            maxSpots: 8,
            description: "Build on fundamentals with advanced combinations and sparring drills."
          },
          {
            id: "thu-630",
            day: "Thursday",
            time: "18:30",
            endTime: "19:30",
            classType: "Beginner Muay Thai",
            instructor: "Coach Sarah",
            maxSpots: 8,
            description: "Perfect for beginners. Learn basic techniques, footwork, and conditioning."
          },
          {
            id: "thu-745",
            day: "Thursday",
            time: "19:45",
            endTime: "20:45",
            classType: "Intermediate Training",
            instructor: "Coach Sarah",
            maxSpots: 8,
            description: "Build on fundamentals with advanced combinations and sparring drills."
          },
          {
            id: "fri-630",
            day: "Friday",
            time: "18:30",
            endTime: "20:00",
            classType: "Sparring Session",
            instructor: "Coach John",
            maxSpots: 8,
            description: "Advanced sparring session for intermediate and advanced students."
          }
        ];
        await this.saveTimetable(defaultTimetable);
      }

      // Initialize empty bookings array
      const bookings = await this.getBookings();
      if (bookings.length === 0) {
        await this.saveBookings([]);
      }

      console.log('Default data initialization complete');
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  }
}
