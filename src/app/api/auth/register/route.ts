import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const isProduction = process.env.NODE_ENV === 'production';

// Simple in-memory storage for production (temporary solution)
let inMemoryUsers: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Read existing users
    let users = [];
    if (isProduction) {
      // Try Vercel KV first, fallback to in-memory storage
      try {
        const usersData = await kv.get('users');
        users = usersData ? JSON.parse(usersData as string) : [];
        console.log('KV read successful, found', users.length, 'users');
      } catch (kvError) {
        console.error('KV read error:', kvError);
        console.log('Falling back to in-memory storage');
        users = inMemoryUsers;
      }
    } else {
      // Use file system in development
      if (fs.existsSync(usersFilePath)) {
        const usersData = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(usersData);
      }
    }

    // Check if user already exists
    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isAdmin: false,
    };

    // Add user to array
    users.push(newUser);

    // Save users data
    if (isProduction) {
      // Try Vercel KV first, fallback to in-memory storage
      try {
        await kv.set('users', JSON.stringify(users, null, 2));
        console.log('KV write successful, saved', users.length, 'users');
      } catch (kvError) {
        console.error('KV write error:', kvError);
        console.error('KV error details:', {
          message: kvError.message,
          code: kvError.code,
          name: kvError.name
        });
        
        // Fallback to in-memory storage
        console.log('KV write failed, using in-memory storage');
        inMemoryUsers = users;
      }
    } else {
      // Use file system in development
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'User registered successfully',
      user: userWithoutPassword,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
