import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    console.log('Testing Redis connection...');
    
    // Test setting a value
    await kv.set('test-key', 'test-value');
    console.log('Set test value successfully');
    
    // Test getting the value
    const value = await kv.get('test-key');
    console.log('Retrieved test value:', value);
    
    // Test setting users data
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
    
    await kv.set('users', testUsers);
    console.log('Set users data successfully');
    
    const retrievedUsers = await kv.get('users');
    console.log('Retrieved users:', retrievedUsers);
    
    return NextResponse.json({
      message: 'Redis test complete',
      testValue: value,
      usersCount: Array.isArray(retrievedUsers) ? retrievedUsers.length : 0,
      users: retrievedUsers
    });
  } catch (error) {
    console.error('Redis test error:', error);
    return NextResponse.json(
      { error: 'Redis test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
