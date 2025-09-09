import { createBrowserClient } from '@supabase/ssr'
import { localAuth } from './localAuth';

let supabase: any = null;

// Only create the client if environment variables are available
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Initializing Supabase client with URL:', supabaseUrl);
  
  supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
} else {
  console.log('Supabase not configured, using local auth for development');
  // Use local auth for development when Supabase is not configured
  supabase = {
    auth: {
      getSession: async () => {
        console.log('Local auth: getSession called');
        return await localAuth.getSession();
      },
      getUser: async () => {
        console.log('Local auth: getUser called');
        return await localAuth.getUser();
      },
      signInWithPassword: async (credentials: { email: string; password: string }) => {
        console.log('Local auth: signInWithPassword called');
        return await localAuth.signInWithPassword(credentials);
      },
      signUp: async (credentials: { email: string; password: string; options?: any }) => {
        console.log('Local auth: signUp called');
        return await localAuth.signUp(credentials);
      },
      signOut: async () => {
        console.log('Local auth: signOut called');
        return await localAuth.signOut();
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        console.log('Local auth: onAuthStateChange called');
        return localAuth.onAuthStateChange(callback);
      }
    }
  };
}

export { supabase };

// Helper function to get the current user
export const getCurrentUser = async () => {
  if (!supabase?.auth) return null;
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

// Helper function to get the current session
export const getCurrentSession = async () => {
  if (!supabase?.auth) return null;
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting current session:', error)
      return null
    }
    return session
  } catch (error) {
    console.error('Error in getCurrentSession:', error)
    return null
  }
}
