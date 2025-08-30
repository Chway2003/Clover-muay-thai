import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const isProduction = process.env.NODE_ENV === 'production';
const productionUsersPath = '/tmp/users.json';

export async function POST(request: NextRequest) {
  try {
    // Simple security check
    const { adminKey } = await request.json();
    
    if (adminKey !== 'setup-all-users-2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create all users with correct password hashes
    const allUsers = [
      {
        id: '1756569935108',
        email: 'test@test.com',
        name: 'Test User',
        password: '$2b$12$ZUUGh6AbiY5PiKjnVJzGkex08T5JsdmfMkXLSUonCAFRYnqOz8tay', // test123
        createdAt: new Date().toISOString(),
        isAdmin: false
      },
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
      }
    ];

    // Save users data
    if (isProduction) {
      try {
        await kv.set('users', JSON.stringify(allUsers, null, 2));
        console.log('KV write successful, created all users');
      } catch (kvError) {
        console.error('KV write error:', kvError);
        try {
          fs.writeFileSync(productionUsersPath, JSON.stringify(allUsers, null, 2));
          console.log('Successfully created all users in /tmp');
        } catch (fileError) {
          console.error('Error writing to /tmp:', fileError);
          return NextResponse.json(
            { error: 'Failed to create users' },
            { status: 500 }
          );
        }
      }
    } else {
      fs.writeFileSync(usersFilePath, JSON.stringify(allUsers, null, 2));
    }

    return NextResponse.json({
      message: 'All users created successfully',
      users: allUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }))
    });

  } catch (error) {
    console.error('Setup users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
