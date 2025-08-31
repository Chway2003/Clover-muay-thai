const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qxfevarwdwumsdruvcqw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4ZmV2YXJ3ZHd1bXNkcnV2Y3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzI0ODAsImV4cCI6MjA3MjIwODQ4MH0.XUaMB111gYgkspoRj47O1umwJsZCrgL1i4Fk2T0oegk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLoginFlow() {
  console.log('🧪 Testing complete login flow...\n');
  
  try {
    // Step 1: Login
    console.log('1. Attempting login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'clovermuaythai@gmail.com',
      password: 'Clovermt25'
    });
    
    if (loginError) {
      console.log('❌ Login failed:', loginError.message);
      return;
    }
    
    console.log('✅ Login successful');
    console.log('   User:', loginData.user?.email);
    console.log('   Session exists:', !!loginData.session);
    
    // Step 2: Check session immediately after login
    console.log('\n2. Checking session after login...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session check failed:', sessionError.message);
    } else if (session) {
      console.log('✅ Session found:');
      console.log('   User:', session.user.email);
      console.log('   Expires at:', new Date(session.expires_at * 1000).toLocaleString());
      console.log('   Access token length:', session.access_token?.length || 0);
    } else {
      console.log('❌ No session found after login');
    }
    
    // Step 3: Check user
    console.log('\n3. Checking user after login...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ User check failed:', userError.message);
    } else if (user) {
      console.log('✅ User found:', user.email);
    } else {
      console.log('❌ No user found after login');
    }
    
    // Step 4: Wait a moment and check again
    console.log('\n4. Waiting 2 seconds and checking session again...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { data: { session: session2 }, error: sessionError2 } = await supabase.auth.getSession();
    
    if (sessionError2) {
      console.log('❌ Session check 2 failed:', sessionError2.message);
    } else if (session2) {
      console.log('✅ Session still exists after 2 seconds');
    } else {
      console.log('❌ Session lost after 2 seconds');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testLoginFlow().catch(console.error);
