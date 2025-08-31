'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail(''); // Clear the form
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (error: any) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-clover-green flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white mb-2">Clover Muay Thai</h1>
            <p className="text-clover-gold">Reset your password</p>
          </Link>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Forgot Password?
          </h2>
          
          <p className="text-gray-600 mb-6 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter your email address"
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
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-clover-gold text-clover-green py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-clover-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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

