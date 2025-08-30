import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

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
    const users = await DataService.getUsers();

    // Update the test user's password hash
    let updated = false;
    const updatedUsers = users.map((user: any) => {
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
    await DataService.saveUsers(updatedUsers);

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
