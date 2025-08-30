import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

    // Read users file to get fresh user data
    if (!fs.existsSync(usersFilePath)) {
      return NextResponse.json(
        { error: 'No users found' },
        { status: 404 }
      );
    }

    const usersData = fs.readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);
    
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

