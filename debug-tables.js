// Debug: Check what tables exist in your Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mtpbbikeeksykvxzkblv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cGJiaWtlZWtzeWt2eHprYmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Nzk2NDcsImV4cCI6MjA2NDM1NTY0N30.DpwUsgPTbJZIrgLsWZgwv3ouNM1bQjszZOAPP9eZ6uc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugTables() {
  console.log('🔍 Checking what tables exist in your Supabase...\n');
  
  // Try different possible table names
  const possibleTableNames = [
    'lotto_results',
    'lotto_645',
    'lotto_data', 
    'lottery_results',
    'lottery_data',
    'lotto',
    'lottery',
    'results'
  ];
  
  for (const tableName of possibleTableNames) {
    try {
      console.log(`Testing table: "${tableName}"`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`   ❌ ${error.message}`);
      } else {
        console.log(`   ✅ Found table "${tableName}"!`);
        if (data && data.length > 0) {
          console.log('   📊 Sample row:', JSON.stringify(data[0], null, 2));
        }
        console.log('');
        
        // If we found a table, try to get all data
        const { data: allData, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' });
          
        if (!countError && allData) {
          console.log(`   📈 Total rows: ${allData.length}`);
          if (allData.length > 0) {
            console.log(`   🎯 Found your data! Table name is: "${tableName}"`);
            return tableName;
          }
        }
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }
  }
  
  console.log('\n🤔 No tables found with the expected names.');
  console.log('Please check your Supabase dashboard and tell me the exact table name you created.');
  return null;
}

debugTables();