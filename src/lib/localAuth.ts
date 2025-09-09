// Local development authentication system
// This works when Supabase is not configured locally

interface LocalUser {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

interface LocalSession {
  user: LocalUser;
  access_token: string;
  expires_at: number;
}

class LocalAuth {
  private static instance: LocalAuth;
  private currentUser: LocalUser | null = null;
  private currentSession: LocalSession | null = null;
  private listeners: Array<(event: string, session: LocalSession | null) => void> = [];

  static getInstance(): LocalAuth {
    if (!LocalAuth.instance) {
      LocalAuth.instance = new LocalAuth();
    }
    return LocalAuth.instance;
  }

  // Initialize with default admin user for local development
  initialize() {
    const adminUser: LocalUser = {
      id: 'local-admin-123',
      email: 'admin@clovermuaythai.com',
      name: 'Admin',
      isAdmin: true,
      createdAt: new Date().toISOString()
    };

    const session: LocalSession = {
      user: adminUser,
      access_token: 'local-token-' + Date.now(),
      expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    this.currentUser = adminUser;
    this.currentSession = session;

    // Notify listeners
    this.listeners.forEach(listener => listener('SIGNED_IN', session));
  }

  async getSession() {
    if (!this.currentSession) {
      this.initialize();
    }
    return { data: { session: this.currentSession }, error: null };
  }

  async getUser() {
    if (!this.currentUser) {
      this.initialize();
    }
    return { data: { user: this.currentUser }, error: null };
  }

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    // For local development, accept any email/password combination
    // In production, this would be handled by Supabase
    console.log('Local auth: signInWithPassword called with', email);
    
    const user: LocalUser = {
      id: 'local-user-' + Date.now(),
      email: email,
      name: email.split('@')[0],
      isAdmin: email === 'admin@clovermuaythai.com' || email === 'clovermuaythai@gmail.com',
      createdAt: new Date().toISOString()
    };

    const session: LocalSession = {
      user: user,
      access_token: 'local-token-' + Date.now(),
      expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    this.currentUser = user;
    this.currentSession = session;

    // Notify listeners
    this.listeners.forEach(listener => listener('SIGNED_IN', session));

    return { data: { user, session }, error: null };
  }

  async signUp({ email, password, options }: { 
    email: string; 
    password: string; 
    options?: { data?: { name?: string; isAdmin?: boolean } } 
  }) {
    console.log('Local auth: signUp called with', email);
    
    const user: LocalUser = {
      id: 'local-user-' + Date.now(),
      email: email,
      name: options?.data?.name || email.split('@')[0],
      isAdmin: options?.data?.isAdmin || false,
      createdAt: new Date().toISOString()
    };

    const session: LocalSession = {
      user: user,
      access_token: 'local-token-' + Date.now(),
      expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    this.currentUser = user;
    this.currentSession = session;

    // Notify listeners
    this.listeners.forEach(listener => listener('SIGNED_IN', session));

    return { data: { user, session }, error: null };
  }

  async signOut() {
    console.log('Local auth: signOut called');
    
    this.currentUser = null;
    this.currentSession = null;

    // Notify listeners
    this.listeners.forEach(listener => listener('SIGNED_OUT', null));

    return { error: null };
  }

  onAuthStateChange(callback: (event: string, session: LocalSession | null) => void) {
    this.listeners.push(callback);
    
    // Return subscription object
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          }
        }
      }
    };
  }
}

export const localAuth = LocalAuth.getInstance();
