import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/dataService';

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
    const users = await DataService.getUsers();

    // Update passwords for specific accounts
    let adminUpdated = false;
    let userUpdated = false;
    
    const updatedUsers = users.map((user: any) => {
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
    await DataService.saveUsers(updatedUsers);

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
