const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qxfevarwdwumsdruvcqw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4ZmV2YXJ3ZHd1bXNkcnV2Y3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzI0ODAsImV4cCI6MjA3MjIwODQ4MH0.XUaMB111gYgkspoRj47O1umwJsZCrgL1i4Fk2T0oegk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSession() {
  console.log('🔍 Debugging Supabase session...\n');
  
  try {
    // Test 1: Check current session
    console.log('1. Checking current session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
    } else if (session) {
      console.log('✅ Active session found:');
      console.log('   User:', session.user.email);
      console.log('   Expires at:', new Date(session.expires_at * 1000).toLocaleString());
      console.log('   Access token exists:', !!session.access_token);
      console.log('   Refresh token exists:', !!session.refresh_token);
    } else {
      console.log('ℹ️ No active session');
    }
    
    // Test 2: Try to get current user
    console.log('\n2. Getting current user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ User error:', userError.message);
    } else if (user) {
      console.log('✅ Current user:', user.email);
      console.log('   Email confirmed:', !!user.email_confirmed_at);
      console.log('   Created at:', new Date(user.created_at).toLocaleString());
    } else {
      console.log('ℹ️ No current user');
    }
    
    // Test 3: Check if we can make an authenticated request
    console.log('\n3. Testing authenticated request...');
    if (session?.access_token) {
      const { data, error } = await supabase.from('users').select('*').limit(1);
      if (error) {
        console.log('❌ Authenticated request failed:', error.message);
      } else {
        console.log('✅ Authenticated request successful');
      }
    } else {
      console.log('ℹ️ No access token, skipping authenticated request test');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

debugSession().catch(console.error);
