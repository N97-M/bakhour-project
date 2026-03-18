const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  urlMatch[1].trim(),
  keyMatch[1].trim()
);

async function testSignup() {
  console.log('Testing signup against:', urlMatch[1].trim());
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test_server_signup_123@example.com',
      password: 'password123',
    });
    console.log('Data:', data);
    console.log('Error:', error);
  } catch (err) {
    console.log('Caught Exception:', err);
  }
}

testSignup();
