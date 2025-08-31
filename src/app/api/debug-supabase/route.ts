import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Test getting users (this will fail if not properly configured)
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    return NextResponse.json({
      message: 'Supabase debug info',
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      },
      session: {
        exists: !!session,
        error: sessionError?.message || null
      },
      users: {
        count: users?.users?.length || 0,
        error: usersError?.message || null
      }
    });

  } catch (error) {
    console.error('Supabase debug error:', error);
    return NextResponse.json(
      { 
        error: 'Debug failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: {
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      },
      { status: 500 }
    );
  }
}
