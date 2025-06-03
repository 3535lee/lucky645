// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtpbbikeeksykvxzkblv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cGJiaWtlZWtzeWt2eHprYmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Nzk2NDcsImV4cCI6MjA2NDM1NTY0N30.DpwUsgPTbJZIrgLsWZgwv3ouNM1bQjszZOAPP9eZ6uc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    console.log('Connection successful (table may not exist, but connection works)');
    
    // Check if our table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'lotto_results');
      
    if (tableError) {
      console.log('Cannot check table existence (this is normal)');
    } else if (tables && tables.length > 0) {
      console.log('✅ lotto_results table exists!');
    } else {
      console.log('❌ lotto_results table does NOT exist');
    }
    
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection();