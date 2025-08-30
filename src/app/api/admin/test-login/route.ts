import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

export async function POST(request: NextRequest) {
  try {
    console.log('Testing login flow...');
    
    // Test finding user by email
    const email = 'test@test.com';
    console.log('Looking for user with email:', email);
    
    const user = await DataService.findUserByEmail(email);
    console.log('User found:', user ? 'YES' : 'NO');
    console.log('User details:', user);
    
    if (!user) {
      // Try to get all users to see what's available
      const allUsers = await DataService.getUsers();
      console.log('All users count:', allUsers.length);
      console.log('All users:', allUsers);
    }
    
    return NextResponse.json({
      message: 'Login test complete',
      userFound: !!user,
      user: user,
      allUsersCount: (await DataService.getUsers()).length
    });
  } catch (error) {
    console.error('Login test error:', error);
    return NextResponse.json(
      { error: 'Login test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
