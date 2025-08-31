import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get the current session (user should be authenticated via the reset link)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Invalid or expired reset session. Please request a new password reset.' },
        { status: 401 }
      );
    }

    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Supabase password update error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update password' },
        { status: 400 }
      );
    }

    console.log(`Password reset successful for user: ${session.user.email}`);

    return NextResponse.json({
      message: 'Password has been reset successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

