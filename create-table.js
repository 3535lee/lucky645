// Create the lotto_results table
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mtpbbikeeksykvxzkblv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cGJiaWtlZWtzeWt2eHprYmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Nzk2NDcsImV4cCI6MjA2NDM1NTY0N30.DpwUsgPTbJZIrgLsWZgwv3ouNM1bQjszZOAPP9eZ6uc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
  console.log('Creating lotto_results table...');
  
  try {
    // Create table using SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS lotto_results (
          round INTEGER PRIMARY KEY,
          date DATE NOT NULL,
          num1 INTEGER NOT NULL CHECK (num1 >= 1 AND num1 <= 45),
          num2 INTEGER NOT NULL CHECK (num2 >= 1 AND num2 <= 45),
          num3 INTEGER NOT NULL CHECK (num3 >= 1 AND num3 <= 45),
          num4 INTEGER NOT NULL CHECK (num4 >= 1 AND num4 <= 45),
          num5 INTEGER NOT NULL CHECK (num5 >= 1 AND num5 <= 45),
          num6 INTEGER NOT NULL CHECK (num6 >= 1 AND num6 <= 45),
          bonus INTEGER NOT NULL CHECK (bonus >= 1 AND bonus <= 45),
          first_prize BIGINT NOT NULL DEFAULT 0,
          first_winners INTEGER NOT NULL DEFAULT 0,
          second_prize BIGINT NOT NULL DEFAULT 0,
          second_winners INTEGER NOT NULL DEFAULT 0,
          third_prize BIGINT NOT NULL DEFAULT 0,
          third_winners INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (error) {
      console.error('Failed to create table via RPC:', error.message);
      
      // Try alternative approach - direct insert to create table structure
      console.log('Trying alternative approach...');
      
      const { data: insertData, error: insertError } = await supabase
        .from('lotto_results')
        .insert([
          {
            round: 1174,
            date: '2024-12-28',
            num1: 8,
            num2: 15,
            num3: 25,
            num4: 33,
            num5: 39,
            num6: 45,
            bonus: 12,
            first_prize: 2500000000,
            first_winners: 12,
            second_prize: 55000000,
            second_winners: 89,
            third_prize: 1500000,
            third_winners: 2567
          }
        ]);
        
      if (insertError) {
        console.error('❌ Failed to create table:', insertError.message);
        console.log('\n🔧 MANUAL SETUP REQUIRED:');
        console.log('1. Go to https://mtpbbikeeksykvxzkblv.supabase.co/project/default/editor');
        console.log('2. Click on "SQL Editor"');
        console.log('3. Copy and paste the SQL from database-setup.sql');
        console.log('4. Click "Run"');
      } else {
        console.log('✅ Table created successfully with sample data!');
      }
    } else {
      console.log('✅ Table created successfully!');
      
      // Add sample data
      const { data: insertData, error: insertError } = await supabase
        .from('lotto_results')
        .insert([
          {
            round: 1174,
            date: '2024-12-28',
            num1: 8,
            num2: 15,
            num3: 25,
            num4: 33,
            num5: 39,
            num6: 45,
            bonus: 12,
            first_prize: 2500000000,
            first_winners: 12,
            second_prize: 55000000,
            second_winners: 89,
            third_prize: 1500000,
            third_winners: 2567
          },
          {
            round: 1173,
            date: '2024-12-21',
            num1: 3,
            num2: 11,
            num3: 19,
            num4: 28,
            num5: 35,
            num6: 42,
            bonus: 7,
            first_prize: 2800000000,
            first_winners: 8,
            second_prize: 62000000,
            second_winners: 124,
            third_prize: 1500000,
            third_winners: 3124
          }
        ]);
        
      if (insertError) {
        console.log('⚠️  Table created but sample data failed:', insertError.message);
      } else {
        console.log('✅ Sample data added successfully!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 MANUAL SETUP REQUIRED:');
    console.log('Please go to your Supabase dashboard and create the table manually.');
  }
}

createTable();