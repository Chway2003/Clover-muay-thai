import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          isAdmin: false
        }
      }
    });

    if (error) {
      console.error('Supabase registration error:', error);
      
      // Handle specific Supabase errors
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || 'Registration failed' },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Return user data
    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || name,
      isAdmin: data.user.user_metadata?.isAdmin || false,
      createdAt: data.user.created_at,
      emailConfirmed: data.user.email_confirmed_at !== null
    };

    return NextResponse.json({
      message: 'User registered successfully',
      user: userData,
      session: data.session
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}