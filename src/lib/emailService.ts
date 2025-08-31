import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  // For production, use your SMTP settings
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'clovermuaythai@gmail.com',
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
      },
    });
  }

  // For development, use a test account or console logging
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal.pass',
    },
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
): Promise<void> => {
  const transporter = createTransporter();
  
  // Create reset URL
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.clovermuaythai.com'}/auth/reset-password?token=${resetToken}`;
  
  // Email template
  const mailOptions = {
    from: `"Clover Muay Thai" <${process.env.SMTP_USER || 'clovermuaythai@gmail.com'}>`,
    to: email,
    subject: 'Password Reset - Clover Muay Thai',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Clover Muay Thai</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              color: #2d5016;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .reset-button {
              display: inline-block;
              background-color: #fbbf24;
              color: #2d5016;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .reset-button:hover {
              background-color: #f59e0b;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 14px;
              color: #666;
            }
            .warning {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🥊 Clover Muay Thai</div>
            </div>
            
            <h2>Password Reset Request</h2>
            
            <p>Hello ${name},</p>
            
            <p>We received a request to reset your password for your Clover Muay Thai account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your password will remain unchanged until you click the link above</li>
              </ul>
            </div>
            
            <p>If you have any questions or need assistance, please contact us at <a href="mailto:clovermuaythai@gmail.com">clovermuaythai@gmail.com</a> or call us at +353 83 372 6141.</p>
            
            <div class="footer">
              <p><strong>Clover Muay Thai</strong><br>
              14 Miltown Road, Dublin 6<br>
              Eircode: D06 AK57, Ireland<br>
              Phone: +353 83 372 6141<br>
              Email: clovermuaythai@gmail.com</p>
              
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                This email was sent because a password reset was requested for your account. 
                If you did not request this, please ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset - Clover Muay Thai
      
      Hello ${name},
      
      We received a request to reset your password for your Clover Muay Thai account.
      
      To reset your password, please visit the following link:
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, please ignore this email.
      
      If you have any questions, contact us at clovermuaythai@gmail.com or +353 83 372 6141.
      
      Best regards,
      Clover Muay Thai Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    
    // In development, log the preview URL for testing
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Test email configuration
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

