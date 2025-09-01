import { NextRequest, NextResponse } from 'next/server';
import { testEmailConfig } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    console.log('Testing email configuration...');
    
    const isValid = await testEmailConfig();
    
    if (isValid) {
      return NextResponse.json({
        message: 'Email configuration is valid and ready to use',
        status: 'success'
      });
    } else {
      return NextResponse.json({
        message: 'Email configuration is invalid. Please check your SMTP settings.',
        status: 'error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { 
        message: 'Email configuration test failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      },
      { status: 500 }
    );
  }
}


