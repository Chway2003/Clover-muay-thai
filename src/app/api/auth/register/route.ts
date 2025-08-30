import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate name
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    const dataDir = path.dirname(usersFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Check if users.json exists, if not create it
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, '[]', 'utf-8');
    }

    // Read existing users with better error handling
    let usersData: string;
    let users: any[];
    
    try {
      console.log('Reading users file:', usersFilePath);
      usersData = fs.readFileSync(usersFilePath, 'utf-8');
      console.log('Users file size:', usersData.length, 'characters');
      
      if (usersData.trim() === '') {
        console.log('Users file is empty, initializing with empty array');
        users = [];
      } else {
        users = JSON.parse(usersData);
        console.log('Successfully parsed users file, found', users.length, 'users');
      }
    } catch (readError) {
      console.error('Error reading users file:', readError);
      console.error('Read error details:', {
        code: readError.code,
        errno: readError.errno,
        path: readError.path,
        syscall: readError.syscall
      });
      
      // If file is corrupted or doesn't exist, create a new one
      users = [];
      try {
        fs.writeFileSync(usersFilePath, '[]', 'utf-8');
        console.log('Created new users file');
      } catch (createError) {
        console.error('Error creating new users file:', createError);
        return NextResponse.json(
          { error: 'Unable to initialize user database' },
          { status: 500 }
        );
      }
    }

    // Check if user already exists
    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isAdmin: false, // Default to non-admin
    };

    // Add user to array
    users.push(newUser);

    // Write back to file with better error handling
    try {
      const jsonData = JSON.stringify(users, null, 2);
      console.log('Attempting to write users file:', usersFilePath);
      console.log('Data size:', jsonData.length, 'characters');
      
      // Use atomic write operation to prevent corruption
      const tempFilePath = usersFilePath + '.tmp';
      fs.writeFileSync(tempFilePath, jsonData, 'utf-8');
      
      // Verify the written data
      const writtenData = fs.readFileSync(tempFilePath, 'utf-8');
      JSON.parse(writtenData); // This will throw if JSON is invalid
      
      // If verification passes, rename temp file to actual file
      fs.renameSync(tempFilePath, usersFilePath);
      
      console.log('Successfully wrote users file');
    } catch (writeError) {
      console.error('Error writing users file:', writeError);
      console.error('Write error details:', {
        code: writeError.code,
        errno: writeError.errno,
        path: writeError.path,
        syscall: writeError.syscall
      });
      
      // Clean up temp file if it exists
      const tempFilePath = usersFilePath + '.tmp';
      if (fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (cleanupError) {
          console.error('Error cleaning up temp file:', cleanupError);
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to save user data. Please try again.' },
        { status: 500 }
      );
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'User registered successfully',
      user: userWithoutPassword,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        errorMessage = 'File system error - please try again';
      } else if (error.message.includes('EACCES')) {
        errorMessage = 'Permission error - please contact support';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Data corruption error - please try again';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
