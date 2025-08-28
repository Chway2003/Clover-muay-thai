import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const resetTokensFilePath = path.join(process.cwd(), 'data', 'reset-tokens.json');

// Helper function to read reset tokens
const readResetTokens = () => {
  if (!fs.existsSync(resetTokensFilePath)) {
    return [];
  }
  const data = fs.readFileSync(resetTokensFilePath, 'utf-8');
  return JSON.parse(data);
};

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Validate input
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Read existing reset tokens
    const resetTokens = readResetTokens();

    // Find the token and check if it's valid
    const resetToken = resetTokens.find((t: any) => t.token === token);
    
    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    const now = new Date();
    const expiryDate = new Date(resetToken.expiresAt);
    
    if (now > expiryDate) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Token is valid
    return NextResponse.json({
      message: 'Token is valid',
      userId: resetToken.userId,
      email: resetToken.email
    });

  } catch (error) {
    console.error('Validate reset token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
