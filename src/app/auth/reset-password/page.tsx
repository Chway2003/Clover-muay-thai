'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid reset link. Please request a new password reset.');
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/validate-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setEmail(data.email);
        } else {
          setError(data.error || 'Invalid or expired reset link');
        }
      } catch (error: any) {
        setError('Network error. Please try again.');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password has been reset successfully! You can now sign in with your new password.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (error: any) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-clover-green flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clover-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clover-green flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white mb-2">Clover Muay Thai</h1>
            <p className="text-clover-gold">Set your new password</p>
          </Link>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Reset Password
          </h2>
          
          {email && (
            <p className="text-gray-600 mb-6 text-center">
              Setting new password for: <span className="font-medium">{email}</span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter your new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Confirm your new password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {message && (
              <div className="text-green-600 text-sm bg-green-50 p-4 rounded-lg border border-green-200">
                {message}
                <p className="text-xs mt-2">Redirecting to login page...</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full bg-clover-gold text-clover-green py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-clover-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-clover-gold hover:text-yellow-400 font-medium">
                Sign in here
              </Link>
            </p>
            
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 block">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

