import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const isProduction = process.env.NODE_ENV === 'production';
const productionUsersPath = '/tmp/users.json';

// Correct password hashes
const adminPasswordHash = '$2b$12$DHl2ETNoX4mW0OuagNJVWuZqMS/7s3o.AlxvfGb4bcnmbmlU0FPq.'; // Clovermt25
const userPasswordHash = '$2b$12$6FBtsby0odPfvs9lx4K/BudQZLNCKt7Ag4XPNn8VJKBOGdTAo3oAO'; // Choual2003

export async function POST(request: NextRequest) {
  try {
    // Simple security check
    const { adminKey } = await request.json();
    
    if (adminKey !== 'update-passwords-2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Read existing users
    let users = [];
    if (isProduction) {
      try {
        const usersData = await kv.get('users');
        users = usersData ? JSON.parse(usersData as string) : [];
      } catch (kvError) {
        console.error('KV read error:', kvError);
        try {
          if (fs.existsSync(productionUsersPath)) {
            const usersData = fs.readFileSync(productionUsersPath, 'utf-8');
            users = JSON.parse(usersData);
          }
        } catch (fileError) {
          console.error('Error reading from /tmp:', fileError);
        }
      }
    } else {
      if (fs.existsSync(usersFilePath)) {
        const usersData = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(usersData);
      }
    }

    // Update passwords for specific accounts
    let adminUpdated = false;
    let userUpdated = false;
    
    users = users.map((user: any) => {
      if (user.email === 'clovermuaythai@gmail.com') {
        adminUpdated = true;
        return {
          ...user,
          password: adminPasswordHash
        };
      } else if (user.email === 'achoual37@gmail.com') {
        userUpdated = true;
        return {
          ...user,
          password: userPasswordHash
        };
      }
      return user;
    });

    // Save updated users data
    if (isProduction) {
      try {
        await kv.set('users', JSON.stringify(users, null, 2));
        console.log('KV write successful, updated user passwords');
      } catch (kvError) {
        console.error('KV write error:', kvError);
        try {
          fs.writeFileSync(productionUsersPath, JSON.stringify(users, null, 2));
          console.log('Successfully updated user passwords in /tmp');
        } catch (fileError) {
          console.error('Error writing to /tmp:', fileError);
          return NextResponse.json(
            { error: 'Failed to update user passwords' },
            { status: 500 }
          );
        }
      }
    } else {
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    }

    return NextResponse.json({
      message: 'User passwords updated successfully',
      adminUpdated,
      userUpdated,
      updatedAccounts: {
        admin: adminUpdated ? 'clovermuaythai@gmail.com' : 'not found',
        user: userUpdated ? 'achoual37@gmail.com' : 'not found'
      }
    });

  } catch (error) {
    console.error('Update passwords error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
