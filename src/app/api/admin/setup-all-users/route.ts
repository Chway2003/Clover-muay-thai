import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { DataService } from '@/lib/dataService';

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

    // Save users data using DataService
    await DataService.saveUsers(allUsers);

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
