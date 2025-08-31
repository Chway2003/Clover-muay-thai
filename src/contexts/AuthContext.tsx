'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isAdmin: boolean;
  emailConfirmed: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else if (session && mounted) {
          console.log('Initial session found:', session.user?.email);
          setSession(session);
          setUser(transformSupabaseUser(session.user));
        } else if (mounted) {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        if (session) {
          console.log('Setting session from auth state change:', session.user?.email);
          setSession(session);
          setUser(transformSupabaseUser(session.user));
        } else {
          console.log('Clearing session from auth state change');
          setSession(null);
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to transform Supabase user to our User interface
  const transformSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || 'User',
      isAdmin: supabaseUser.user_metadata?.isAdmin || false,
      createdAt: supabaseUser.created_at,
      emailConfirmed: supabaseUser.email_confirmed_at !== null
    };
  };

  const login = async (email: string, password: string) => {
    try {
      // Use Supabase client directly for login to ensure proper session management
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Supabase login error:', error);
        
        // Handle specific Supabase errors
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before logging in');
        }
        
        throw new Error(error.message || 'Login failed');
      }

      if (!data.user || !data.session) {
        throw new Error('Login failed - no user or session returned');
      }
      
      console.log('Login successful via Supabase client:', data.user.email);
      console.log('Session expires at:', new Date(data.session.expires_at * 1000).toLocaleString());
      
      // The session will be automatically handled by the onAuthStateChange listener
      // No need to manually set user/session here
      
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      // Use Supabase client directly for registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            isAdmin: false
          }
        }
      });

      if (error) {
        console.error('Supabase registration error:', error);
        throw new Error(error.message || 'Registration failed');
      }

      if (!data.user) {
        throw new Error('Registration failed - no user returned');
      }
      
      console.log('Registration successful:', data.user.email);
      
      // If email confirmation is required, show a message
      if (!data.user.email_confirmed_at) {
        throw new Error('Registration successful! Please check your email to confirm your account before logging in.');
      }
      
      // If email is already confirmed, automatically log in
      if (data.session) {
        // Session will be handled by onAuthStateChange
        console.log('Auto-login after registration');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      // Use Supabase client directly for logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase logout error:', error);
      }
      
      // The session will be automatically cleared by the onAuthStateChange listener
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshUser = async () => {
    try {
      if (!session?.access_token) {
        console.log('No session found, cannot refresh user');
        return;
      }

      // Verify token and get fresh user data
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User refreshed:', data.user);
        setUser(data.user);
      } else {
        console.log('Token invalid, logging out');
        await logout();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      await logout();
    }
  };

  const value = {
    user,
    session,
    login,
    register,
    logout,
    refreshUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

