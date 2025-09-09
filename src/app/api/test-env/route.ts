import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'NOT SET',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'NOT SET',
    };
    
    // Check which data service would be used
    const hasSupabaseConfig = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const hasKvConfig = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    
    let dataService = 'unknown';
    if (hasSupabaseConfig) {
      dataService = 'Supabase';
    } else if (isProduction && hasKvConfig) {
      dataService = 'Vercel KV';
    } else {
      dataService = 'File System';
    }
    
    return NextResponse.json({
      environment: envVars,
      dataService,
      checks: {
        hasSupabaseConfig,
        hasKvConfig,
        isProduction
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Environment test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
