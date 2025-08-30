import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export async function POST(request: NextRequest) {
  try {
    console.log('Testing DataService directly...');
    
    // Test saving users
    const testUsers = [
      {
        id: 'test123',
        email: 'test@test.com',
        name: 'Test User',
        password: 'hashedpassword',
        createdAt: new Date().toISOString(),
        isAdmin: false
      }
    ];
    
    console.log('Saving test users...');
    const saveResult = await DataService.saveUsers(testUsers);
    console.log('Save result:', saveResult);
    
    // Test reading users
    console.log('Reading users...');
    const users = await DataService.getUsers();
    console.log('Read result:', users.length, 'users');
    
    return NextResponse.json({
      message: 'DataService test complete',
      saveResult,
      usersCount: users.length,
      users: users
    });
  } catch (error) {
    console.error('DataService test error:', error);
    return NextResponse.json(
      { error: 'DataService test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
