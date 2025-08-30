import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check all possible environment variable names
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      KV_REST_API_URL: process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
      REDIS_URL: process.env.REDIS_URL,
      REDIS_TOKEN: process.env.REDIS_TOKEN,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    };
    
    // Check if any Redis-related variables exist
    const hasAnyRedis = Object.entries(envVars).some(([key, value]) => 
      key.includes('REDIS') || key.includes('KV') || key.includes('UPSTASH')
    );
    
    return NextResponse.json({
      message: 'Environment variables check',
      hasAnyRedis,
      envVars,
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.includes('REDIS') || key.includes('KV') || key.includes('UPSTASH')
      )
    });
  } catch (error) {
    console.error('Environment check error:', error);
    return NextResponse.json(
      { error: 'Environment check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
