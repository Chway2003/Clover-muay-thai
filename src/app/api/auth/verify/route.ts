import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const isProduction = process.env.NODE_ENV === 'production';
const productionUsersPath = '/tmp/users.json'; // For production fallback

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Read users data
    let users = [];
    if (isProduction) {
      // Try Vercel KV first, fallback to /tmp file storage
      try {
        const usersData = await kv.get('users');
        users = usersData ? JSON.parse(usersData as string) : [];
      } catch (kvError) {
        console.error('KV read error:', kvError);
        console.log('Falling back to /tmp file storage');
        
        // Try to read from /tmp directory (writable in Vercel)
        try {
          if (fs.existsSync(productionUsersPath)) {
            const usersData = fs.readFileSync(productionUsersPath, 'utf-8');
            users = JSON.parse(usersData);
            console.log('Read from /tmp, found', users.length, 'users');
          } else {
            console.log('No /tmp users file found, starting with empty array');
            users = [];
          }
        } catch (fileError) {
          console.error('Error reading from /tmp:', fileError);
          users = [];
        }
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
    
    // Find user by ID
    const user = users.find((u: any) => u.id === decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Token verified',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 401 }
    );
  }
}

