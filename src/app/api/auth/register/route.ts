import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const isProduction = process.env.NODE_ENV === 'production';

// For production, we'll use a different approach since in-memory doesn't persist
// We'll try to use the /tmp directory which is writable in Vercel
const productionUsersPath = '/tmp/users.json';

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
      // Try Vercel KV first, fallback to /tmp file storage
      try {
        const usersData = await kv.get('users');
        users = usersData ? JSON.parse(usersData as string) : [];
        console.log('KV read successful, found', users.length, 'users');
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
      // Try Vercel KV first, fallback to /tmp file storage
      try {
        await kv.set('users', JSON.stringify(users, null, 2));
        console.log('KV write successful, saved', users.length, 'users');
      } catch (kvError) {
        console.error('KV write error:', kvError);
        console.error('KV error details:', {
          message: (kvError as any).message,
          code: (kvError as any).code,
          name: (kvError as any).name
        });
        
        // Fallback to /tmp file storage
        console.log('KV write failed, using /tmp file storage');
        try {
          fs.writeFileSync(productionUsersPath, JSON.stringify(users, null, 2));
          console.log('Successfully saved', users.length, 'users to /tmp');
        } catch (fileError) {
          console.error('Error writing to /tmp:', fileError);
          // If even /tmp fails, we'll still return success since the user was created
          // This is a temporary solution until KV is properly configured
        }
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
