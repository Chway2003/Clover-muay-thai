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
    // Get initial session - this ensures session doesn't vanish on refresh
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else if (session) {
          console.log('Initial session found:', session.user?.email);
          setSession(session);
          setUser(transformSupabaseUser(session.user));
        } else {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes - this handles login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session) {
          setSession(session);
          setUser(transformSupabaseUser(session.user));
        } else {
          setSession(null);
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
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
      // Use Supabase client directly for login to ensure proper session handling
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message || 'Login failed');
      }

      if (data.user && data.session) {
        console.log('Login successful via Supabase client');
        // Session will be automatically handled by onAuthStateChange listener
      } else {
        throw new Error('Login failed - no user or session returned');
      }
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
        throw new Error(error.message || 'Registration failed');
      }

      if (data.user) {
        console.log('Registration successful:', data.user.email);
        
        // If email confirmation is required, show a message
        if (!data.user.email_confirmed_at) {
          throw new Error('Registration successful! Please check your email to confirm your account before logging in.');
        }
        
        // If email is already confirmed, automatically log in
        if (data.session) {
          console.log('Auto-login after registration');
          // Session will be handled by onAuthStateChange
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      
      // Use Supabase client directly for logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase logout error:', error);
        throw new Error('Logout failed: ' + error.message);
      }
      
      console.log('Logout successful');
      // The session will be automatically cleared by the onAuthStateChange listener
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      if (!session?.access_token) {
        console.log('No session found, cannot refresh user');
        return;
      }

      // Get fresh user data from Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error refreshing user:', error);
        await logout();
        return;
      }

      if (user) {
        console.log('User refreshed:', user.email);
        setUser(transformSupabaseUser(user));
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

