import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

// Check if we have Redis/KV environment variables
const hasKvConfig = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) || 
         !!(process.env.REDIS_URL);
};

// Get the appropriate Redis configuration
const getRedisConfig = () => {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return {
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN
    };
  } else if (process.env.REDIS_URL) {
    // Parse REDIS_URL to extract components
    const url = new URL(process.env.REDIS_URL);
    return {
      url: `https://${url.hostname}:${url.port || 443}`,
      token: url.password
    };
  }
  return null;
};

// Data service using Vercel KV on production, file system locally
export class DataService {
  private static isProduction() {
    return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  }

  private static getFilePath(filename: string) {
    // Try multiple possible paths
    const possiblePaths = [
      path.join(process.cwd(), 'data', filename),
      path.join(__dirname, '..', '..', 'data', filename),
      path.join(process.cwd(), 'src', '..', 'data', filename)
    ];
    
    console.log('Trying to find file:', { filename, cwd: process.cwd(), __dirname });
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        console.log('Found file at:', filePath);
        return filePath;
      }
      console.log('File not found at:', filePath);
    }
    
    console.log('File not found in any location, using default path');
    return path.join(process.cwd(), 'data', filename);
  }
  // Users
  static async getUsers() {
    try {
      if (this.isProduction() && hasKvConfig()) {
        try {
          const users = await kv.get('users');
          return Array.isArray(users) ? users : [];
        } catch (kvError) {
          console.error('KV error, falling back to file system:', kvError);
          // Fallback to file system in production if KV fails
          const tmpPath = '/tmp/users.json';
          if (fs.existsSync(tmpPath)) {
            const data = fs.readFileSync(tmpPath, 'utf-8');
            return JSON.parse(data);
          }
          return [];
        }
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
      if (this.isProduction() && hasKvConfig()) {
        try {
          await kv.set('users', users);
        } catch (kvError) {
          console.error('KV save error, falling back to file system:', kvError);
          // Fallback to file system in production if KV fails
          const tmpPath = '/tmp/users.json';
          fs.writeFileSync(tmpPath, JSON.stringify(users, null, 2));
        }
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
        try {
          const bookings = await kv.get('bookings');
          return Array.isArray(bookings) ? bookings : [];
        } catch (kvError) {
          console.error('KV error, falling back to file system:', kvError);
          // Fallback to file system in production if KV fails
          const tmpPath = '/tmp/bookings.json';
          if (fs.existsSync(tmpPath)) {
            const data = fs.readFileSync(tmpPath, 'utf-8');
            return JSON.parse(data);
          }
          return [];
        }
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
        try {
          await kv.set('bookings', bookings);
        } catch (kvError) {
          console.error('KV save error, falling back to file system:', kvError);
          // Fallback to file system in production if KV fails
          const tmpPath = '/tmp/bookings.json';
          fs.writeFileSync(tmpPath, JSON.stringify(bookings, null, 2));
        }
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
        try {
          const timetable = await kv.get('timetable');
          return Array.isArray(timetable) ? timetable : [];
        } catch (kvError) {
          console.error('KV error, falling back to file system:', kvError);
          // Fallback to file system in production if KV fails
          const tmpPath = '/tmp/timetable.json';
          if (fs.existsSync(tmpPath)) {
            const data = fs.readFileSync(tmpPath, 'utf-8');
            return JSON.parse(data);
          }
          return [];
        }
      } else {
        // Local file system fallback
        const filePath = this.getFilePath('timetable.json');
        console.log('Looking for timetable file at:', filePath);
        if (!fs.existsSync(filePath)) {
          console.log('Timetable file not found, returning empty array');
          return [];
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(data);
        console.log('Loaded timetable data:', { count: parsed.length, firstItem: parsed[0] });
        return parsed;
      }
    } catch (error) {
      console.error('Error getting timetable:', error);
      return [];
    }
  }

  static async saveTimetable(timetable: any[]) {
    try {
      if (this.isProduction()) {
        try {
          await kv.set('timetable', timetable);
        } catch (kvError) {
          console.error('KV save error, falling back to file system:', kvError);
          // Fallback to file system in production if KV fails
          const tmpPath = '/tmp/timetable.json';
          fs.writeFileSync(tmpPath, JSON.stringify(timetable, null, 2));
        }
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
      console.log('Starting data initialization...');
      
      // Check if users exist
      const users = await this.getUsers();
      console.log('Current users:', { count: users.length });
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

      // Check if timetable exists - only initialize if completely empty
      const timetable = await this.getTimetable();
      console.log('Current timetable data:', { count: timetable.length, isEmpty: timetable.length === 0 });
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

      // Initialize empty bookings array only if it doesn't exist
      const bookings = await this.getBookings();
      console.log('Current bookings:', { count: bookings.length, isArray: Array.isArray(bookings) });
      if (!Array.isArray(bookings)) {
        await this.saveBookings([]);
      }

      console.log('Default data initialization complete');
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  }
}
