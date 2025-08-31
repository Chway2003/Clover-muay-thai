import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Supabase login error:', error);
      
      // Handle specific Supabase errors
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { error: 'Please check your email and confirm your account before logging in' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || 'Login failed' },
        { status: 401 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Login failed - no user or session returned' },
        { status: 500 }
      );
    }

    // Return user data
    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || 'User',
      isAdmin: data.user.user_metadata?.isAdmin || false,
      createdAt: data.user.created_at,
      emailConfirmed: data.user.email_confirmed_at !== null
    };

    console.log('Login API: User found:', userData);
    console.log('Login API: Session created:', data.session ? 'exists' : 'missing');

    // Create response with proper headers for session management
    const response = NextResponse.json({
      message: 'Login successful',
      user: userData,
      session: data.session,
      accessToken: data.session.access_token
    });

    // Set cookies for session persistence
    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      
      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
