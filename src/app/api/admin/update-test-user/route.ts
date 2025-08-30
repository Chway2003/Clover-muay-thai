import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const isProduction = process.env.NODE_ENV === 'production';
const productionUsersPath = '/tmp/users.json';

// Correct password hash for test123
const correctPasswordHash = '$2b$12$ZUUGh6AbiY5PiKjnVJzGkex08T5JsdmfMkXLSUonCAFRYnqOz8tay';

export async function POST(request: NextRequest) {
  try {
    // Simple security check - you might want to add proper admin authentication
    const { adminKey } = await request.json();
    
    if (adminKey !== 'update-test-user-2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Read existing users
    let users = [];
    if (isProduction) {
      // Try Vercel KV first, fallback to /tmp file storage
      try {
        const usersData = await kv.get('users');
        users = usersData ? JSON.parse(usersData as string) : [];
        console.log('Read from KV, found', users.length, 'users');
      } catch (kvError) {
        console.error('KV read error:', kvError);
        console.log('Falling back to /tmp file storage');
        
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

    // Update the test user's password hash
    let updated = false;
    users = users.map((user: any) => {
      if (user.email === 'test@test.com') {
        updated = true;
        return {
          ...user,
          password: correctPasswordHash
        };
      }
      return user;
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      );
    }

    // Save updated users data
    if (isProduction) {
      // Try Vercel KV first, fallback to /tmp file storage
      try {
        await kv.set('users', JSON.stringify(users, null, 2));
        console.log('KV write successful, updated test user password');
      } catch (kvError) {
        console.error('KV write error:', kvError);
        console.log('Falling back to /tmp file storage');
        
        try {
          fs.writeFileSync(productionUsersPath, JSON.stringify(users, null, 2));
          console.log('Successfully updated test user password in /tmp');
        } catch (fileError) {
          console.error('Error writing to /tmp:', fileError);
          return NextResponse.json(
            { error: 'Failed to update user data' },
            { status: 500 }
          );
        }
      }
    } else {
      // Use file system in development
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    }

    return NextResponse.json({
      message: 'Test user password updated successfully',
      updated: true
    });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
