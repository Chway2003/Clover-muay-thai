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
    
    if (adminKey !== 'create-test-user-2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create test user with correct password hash
    const testUser = {
      id: Date.now().toString(),
      email: 'test@test.com',
      name: 'Test User',
      password: '$2b$12$ZUUGh6AbiY5PiKjnVJzGkex08T5JsdmfMkXLSUonCAFRYnqOz8tay', // test123
      createdAt: new Date().toISOString(),
      isAdmin: false
    };

    // Read existing users
    let users = [];
    if (isProduction) {
      try {
        const usersData = await kv.get('users');
        users = usersData ? JSON.parse(usersData as string) : [];
      } catch (kvError) {
        console.error('KV read error:', kvError);
        try {
          if (fs.existsSync(productionUsersPath)) {
            const usersData = fs.readFileSync(productionUsersPath, 'utf-8');
            users = JSON.parse(usersData);
          }
        } catch (fileError) {
          console.error('Error reading from /tmp:', fileError);
        }
      }
    } else {
      if (fs.existsSync(usersFilePath)) {
        const usersData = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(usersData);
      }
    }

    // Remove existing test user if it exists
    users = users.filter((user: any) => user.email !== 'test@test.com');
    
    // Add new test user
    users.push(testUser);

    // Save users data
    if (isProduction) {
      try {
        await kv.set('users', JSON.stringify(users, null, 2));
        console.log('KV write successful, created test user');
      } catch (kvError) {
        console.error('KV write error:', kvError);
        try {
          fs.writeFileSync(productionUsersPath, JSON.stringify(users, null, 2));
          console.log('Successfully created test user in /tmp');
        } catch (fileError) {
          console.error('Error writing to /tmp:', fileError);
          return NextResponse.json(
            { error: 'Failed to create test user' },
            { status: 500 }
          );
        }
      }
    } else {
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    }

    return NextResponse.json({
      message: 'Test user created successfully',
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        createdAt: testUser.createdAt,
        isAdmin: testUser.isAdmin
      }
    });

  } catch (error) {
    console.error('Create test user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
