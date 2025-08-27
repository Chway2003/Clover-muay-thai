'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate name
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate password strength (optional but recommended)
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password should contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, name, password);
      router.push('/'); // Redirect to home page after successful registration
    } catch (error: any) {
      setError(error.message);
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
            <p className="text-clover-gold">Create your account</p>
          </Link>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

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
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                                 <input
                   type="password"
                   id="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   onFocus={() => setPasswordFocused(true)}
                   onBlur={() => setPasswordFocused(false)}
                   required
                   className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold focus:border-transparent"
                   placeholder="Enter your password (min 6 characters)"
                 />
                                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex space-x-1 items-center">
                   {password.split('').map((_, index) => (
                     <div
                       key={index}
                       className="w-2 h-2 bg-clover-gold rounded-full"
                     />
                   ))}
                   {/* Blinking cursor - only show when focused */}
                   {passwordFocused && (
                     <div className="w-0.5 h-4 bg-clover-gold ml-1 animate-pulse"></div>
                   )}
                 </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password strength: {password.length < 6 ? 'Too short' : 
                  !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? 'Weak' : 'Strong'}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                                 <input
                   type="password"
                   id="confirmPassword"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   onFocus={() => setConfirmPasswordFocused(true)}
                   onBlur={() => setConfirmPasswordFocused(false)}
                   required
                   className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clover-gold focus:border-transparent"
                   placeholder="Confirm your password"
                 />
                                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex space-x-1 items-center">
                   {confirmPassword.split('').map((_, index) => (
                     <div
                       key={index}
                       className="w-2 h-2 bg-clover-gold rounded-full"
                     />
                   ))}
                   {/* Blinking cursor - only show when focused */}
                   {confirmPasswordFocused && (
                     <div className="w-0.5 h-4 bg-clover-gold ml-1 animate-pulse"></div>
                   )}
                 </div>
              </div>
              {confirmPassword && (
                <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-clover-gold text-clover-green py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-clover-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-clover-gold hover:text-yellow-400 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

