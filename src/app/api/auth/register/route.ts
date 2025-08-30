import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const isProduction = process.env.NODE_ENV === 'production';

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
      // Use Vercel KV in production
      try {
        const usersData = await kv.get('users');
        users = usersData ? JSON.parse(usersData as string) : [];
      } catch (kvError) {
        console.error('KV read error:', kvError);
        users = [];
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
      // Use Vercel KV in production
      try {
        await kv.set('users', JSON.stringify(users, null, 2));
      } catch (kvError) {
        console.error('KV write error:', kvError);
        return NextResponse.json(
          { error: 'Failed to save user data' },
          { status: 500 }
        );
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
