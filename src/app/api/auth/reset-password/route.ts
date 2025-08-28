import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const resetTokensFilePath = path.join(process.cwd(), 'data', 'reset-tokens.json');

// Helper function to read users
const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write users
const writeUsers = (users: any[]) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
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
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
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

    // Read existing users
    const users = readUsers();

    // Find the user
    const userIndex = users.findIndex((u: any) => u.id === resetToken.userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    users[userIndex].password = hashedPassword;

    // Save the updated users
    writeUsers(users);

    // Remove the used reset token
    const updatedTokens = resetTokens.filter((t: any) => t.token !== token);
    writeResetTokens(updatedTokens);

    console.log('Password reset successfully for user:', resetToken.email);

    return NextResponse.json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
