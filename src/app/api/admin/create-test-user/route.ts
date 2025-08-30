import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { DataService } from '@/lib/dataService';

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

    // Read existing users and remove test user if exists
    const users = await DataService.getUsers();
    const filteredUsers = users.filter((user: any) => user.email !== 'test@test.com');
    
    // Add new test user
    filteredUsers.push(testUser);

    // Save users data
    await DataService.saveUsers(filteredUsers);

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
