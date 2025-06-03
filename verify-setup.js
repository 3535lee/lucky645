// Verify the table was created successfully
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mtpbbikeeksykvxzkblv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cGJiaWtlZWtzeWt2eHprYmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Nzk2NDcsImV4cCI6MjA2NDM1NTY0N30.DpwUsgPTbJZIrgLsWZgwv3ouNM1bQjszZOAPP9eZ6uc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySetup() {
  console.log('🔍 Verifying database setup...\n');
  
  try {
    // Test selecting data
    const { data, error } = await supabase
      .from('lotto_results')
      .select('draw_number, draw_date, number1, number2, number3, number4, number5, number6')
      .order('draw_number', { ascending: false })
      .limit(3);

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n🔧 Please create the table manually in Supabase dashboard');
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Database setup successful!');
      console.log(`📊 Found ${data.length} records:`);
      data.forEach(row => {
        console.log(`   Round ${row.draw_number} (${row.draw_date}): ${row.number1}, ${row.number2}, ${row.number3}, ${row.number4}, ${row.number5}, ${row.number6}`);
      });
      console.log('\n🚀 Your app should now work! Try: npm run dev');
    } else {
      console.log('⚠️  Table exists but is empty');
      console.log('💡 Add some sample data using the SQL from simple-setup.sql');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifySetup();