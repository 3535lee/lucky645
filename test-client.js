// Test client-side Supabase connection
const { supabase, getLottoResults } = require('./src/lib/supabase-client.ts');

console.log('Testing client-side Supabase...');

// Test if we can import and use the client
try {
  console.log('✅ Client imported successfully');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'Fallback URL used');
} catch (error) {
  console.error('❌ Client import failed:', error.message);
}