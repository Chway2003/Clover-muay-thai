import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const resetTokensFilePath = path.join(process.cwd(), 'data', 'reset-tokens.json');

// In a real app, this would be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to read users
const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to read reset tokens
const readResetTokens = () => {
  if (!fs.existsSync(resetTokensFilePath)) {
    return [];
  }
  const data = fs.readFileSync(resetTokensFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write reset tokens
const writeResetTokens = (tokens: any[]) => {
  fs.writeFileSync(resetTokensFilePath, JSON.stringify(tokens, null, 2));
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if users.json exists
    if (!fs.existsSync(usersFilePath)) {
      return NextResponse.json(
        { error: 'No users found' },
        { status: 404 }
      );
    }

    // Read existing users
    const users = readUsers();

    // Find user by email
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store the reset token
    const resetTokens = readResetTokens();
    
    // Remove any existing tokens for this user
    const filteredTokens = resetTokens.filter((token: any) => token.userId !== user.id);
    
    // Add new token
    filteredTokens.push({
      userId: user.id,
      email: user.email,
      token: resetToken,
      expiresAt: resetTokenExpiry.toISOString(),
      createdAt: new Date().toISOString()
    });

    writeResetTokens(filteredTokens);

    // In a real application, you would send an email here
    // For now, we'll just return a success message
    // The reset token would be included in the email link
    
    console.log('Password reset requested for user:', user.email);
    console.log('Reset token:', resetToken);
    console.log('Token expires at:', resetTokenExpiry);

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent. Please check your email.',
      // In development, you might want to include the token for testing
      // In production, remove this line
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
