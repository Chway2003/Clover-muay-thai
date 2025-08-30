import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { kv } from '@vercel/kv';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const isProduction = process.env.NODE_ENV === 'production';

// In a real app, this would be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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
        return NextResponse.json(
          { error: 'No users found' },
          { status: 404 }
        );
      }
    } else {
      // Use file system in development
      if (!fs.existsSync(usersFilePath)) {
        return NextResponse.json(
          { error: 'No users found' },
          { status: 404 }
        );
      }
      const usersData = fs.readFileSync(usersFilePath, 'utf-8');
      users = JSON.parse(usersData);
    }

    // Find user by email
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    console.log('Login API: User found:', user);
    console.log('Login API: User without password:', userWithoutPassword);
    console.log('Login API: Token created:', token ? 'exists' : 'missing');

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
