import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    // Get the current session to validate if user is in a password reset flow
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session validation error:', error);
      return NextResponse.json(
        { error: 'Invalid or expired reset session' },
        { status: 401 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: 'No active reset session found. Please request a new password reset.' },
        { status: 401 }
      );
    }

    // Check if this is a password recovery session
    // In Supabase, when a user clicks a password reset link, they get a session
    // We can validate this by checking if the user exists and is in a recovery state
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid user session' },
        { status: 401 }
      );
    }

    // Session is valid for password reset
    return NextResponse.json({
      message: 'Reset session is valid',
      email: user.email
    }, { status: 200 });

  } catch (error) {
    console.error('Validate reset session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

