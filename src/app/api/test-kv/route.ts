import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request: NextRequest) {
  try {
    // Test KV connectivity
    const testKey = 'test-connection';
    const testValue = 'KV is working';
    
    // Try to set a test value
    await kv.set(testKey, testValue);
    
    // Try to get the test value
    const retrievedValue = await kv.get(testKey);
    
    // Clean up
    await kv.del(testKey);
    
    return NextResponse.json({
      success: true,
      message: 'Vercel KV is working correctly',
      testValue: retrievedValue,
      environment: process.env.NODE_ENV
    });
    
  } catch (error) {
    console.error('KV test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Vercel KV is not working',
      error: (error as any).message,
      environment: process.env.NODE_ENV,
      kvUrl: process.env.KV_URL ? 'Set' : 'Not set',
      kvToken: process.env.KV_REST_API_TOKEN ? 'Set' : 'Not set'
    }, { status: 500 });
  }
}
