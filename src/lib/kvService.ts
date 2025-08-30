import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const isProduction = process.env.NODE_ENV === 'production';
const productionUsersPath = '/tmp/users.json';

// Default users to ensure there's always data available
const defaultUsers = [
  {
    id: '1756320631381',
    email: 'clovermuaythai@gmail.com',
    name: 'admin',
    password: '$2b$12$DHl2ETNoX4mW0OuagNJVWuZqMS/7s3o.AlxvfGb4bcnmbmlU0FPq.', // Clovermt25
    createdAt: '2025-08-27T18:50:31.381Z',
    isAdmin: true
  },
  {
    id: '1756323436829',
    email: 'achoual37@gmail.com',
    name: 'abdul',
    password: '$2b$12$6FBtsby0odPfvs9lx4K/BudQZLNCKt7Ag4XPNn8VJKBOGdTAo3oAO', // Choual2003
    createdAt: '2025-08-27T19:37:16.829Z',
    isAdmin: false
  },
  {
    id: '1756569935108',
    email: 'test@test.com',
    name: 'Test User',
    password: '$2b$12$ZUUGh6AbiY5PiKjnVJzGkex08T5JsdmfMkXLSUonCAFRYnqOz8tay', // test123
    createdAt: '2025-08-30T16:11:02.623Z',
    isAdmin: false
  }
];

export class KVService {
  static async getUsers(): Promise<any[]> {
    if (isProduction) {
      try {
        // Try Vercel KV first
        const usersData = await kv.get('users');
        if (usersData) {
          const users = JSON.parse(usersData as string);
          console.log('KV: Successfully read', users.length, 'users from KV');
          return users;
        }
        
        // If no data in KV, initialize with default users
        console.log('KV: No users found, initializing with default users');
        await this.setUsers(defaultUsers);
        return defaultUsers;
        
      } catch (kvError) {
        console.error('KV read error:', kvError);
        
        // Fallback to /tmp file storage
        try {
          if (fs.existsSync(productionUsersPath)) {
            const usersData = fs.readFileSync(productionUsersPath, 'utf-8');
            const users = JSON.parse(usersData);
            console.log('Fallback: Read', users.length, 'users from /tmp');
            return users;
          }
        } catch (fileError) {
          console.error('Error reading from /tmp:', fileError);
        }
        
        // Final fallback: return default users
        console.log('Using default users as final fallback');
        return defaultUsers;
      }
    } else {
      // Development: use file system
      if (fs.existsSync(usersFilePath)) {
        const usersData = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(usersData);
      }
      return defaultUsers;
    }
  }

  static async setUsers(users: any[]): Promise<void> {
    if (isProduction) {
      try {
        // Try Vercel KV first
        await kv.set('users', JSON.stringify(users, null, 2));
        console.log('KV: Successfully saved', users.length, 'users to KV');
        
        // Also save to /tmp as backup
        try {
          fs.writeFileSync(productionUsersPath, JSON.stringify(users, null, 2));
          console.log('Backup: Saved', users.length, 'users to /tmp');
        } catch (fileError) {
          console.error('Error writing backup to /tmp:', fileError);
        }
        
      } catch (kvError) {
        console.error('KV write error:', kvError);
        
        // Fallback to /tmp file storage
        try {
          fs.writeFileSync(productionUsersPath, JSON.stringify(users, null, 2));
          console.log('Fallback: Saved', users.length, 'users to /tmp');
        } catch (fileError) {
          console.error('Error writing to /tmp:', fileError);
          throw new Error('Failed to save users data');
        }
      }
    } else {
      // Development: use file system
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    }
  }

  static async addUser(newUser: any): Promise<void> {
    const users = await this.getUsers();
    users.push(newUser);
    await this.setUsers(users);
  }

  static async updateUser(userId: string, updates: any): Promise<void> {
    const users = await this.getUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      await this.setUsers(users);
    }
  }

  static async findUserByEmail(email: string): Promise<any | null> {
    const users = await this.getUsers();
    return users.find((u: any) => u.email === email) || null;
  }
}
