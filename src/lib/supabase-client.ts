import { createClient } from '@supabase/supabase-js';

// Client-side Supabase configuration with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtpbbikeeksykvxzkblv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cGJiaWtlZWtzeWt2eHprYmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Nzk2NDcsImV4cCI6MjA2NDM1NTY0N30.DpwUsgPTbJZIrgLsWZgwv3ouNM1bQjszZOAPP9eZ6uc';

// Debug logging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Client Config:', {
    url: supabaseUrl,
    hasKey: !!supabaseKey,
    envUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    envKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for client-side usage
export type LottoResult = {
  round: number;
  date: string;
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num5: number;
  num6: number;
  bonus: number;
  first_prize: number;
  first_winners: number;
  second_prize: number;
  second_winners: number;
  third_prize: number;
  third_winners: number;
};

type SupabaseRow = {
  id: number;
  draw_number: number;
  draw_date: string;
  number1: number;
  number2: number;
  number3: number;
  number4: number;
  number5: number;
  number6: number;
  bonus_number: number;
  first_prize_winners: number;
  first_prize_amount: number;
  second_prize_winners: number;
  second_prize_amount: number;
  third_prize_winners: number;
  third_prize_amount: number;
};

function mapSupabaseRowToLottoResult(row: SupabaseRow): LottoResult {
  return {
    round: row.draw_number,
    date: row.draw_date,
    num1: row.number1,
    num2: row.number2,
    num3: row.number3,
    num4: row.number4,
    num5: row.number5,
    num6: row.number6,
    bonus: row.bonus_number,
    first_prize: row.first_prize_amount,
    first_winners: row.first_prize_winners,
    second_prize: row.second_prize_amount,
    second_winners: row.second_prize_winners,
    third_prize: row.third_prize_amount,
    third_winners: row.third_prize_winners,
  };
}

// Client-side functions
export async function getLottoResults(page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('lotto_results')
    .select('*', { count: 'exact' })
    .order('draw_number', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch lotto results: ${error.message}`);
  }

  const mappedData = (data as SupabaseRow[]).map(mapSupabaseRowToLottoResult);
  return { data: mappedData, count: count || 0 };
}

export type WinningResult = {
  round: number;
  date: string;
  prizeType: '1등' | '2등' | '3등';
  prizeAmount: number;
  matchedNumbers: number;
  hasBonus: boolean;
  winningNumbers: number[];
  bonusNumber: number;
};

export async function checkWinningNumbers(numbers: number[]): Promise<WinningResult[]> {
  if (numbers.length !== 6) {
    throw new Error('Please provide exactly 6 numbers');
  }

  const sortedNumbers = [...numbers].sort((a, b) => a - b);

  // Get all lotto results with complete data
  const { data, error } = await supabase
    .from('lotto_results')
    .select('*')
    .order('draw_number', { ascending: false });

  if (error) {
    throw new Error(`Failed to check winning numbers: ${error.message}`);
  }

  const results: WinningResult[] = [];

  for (const row of data as SupabaseRow[]) {
    const winningNumbers = [row.number1, row.number2, row.number3, row.number4, row.number5, row.number6].sort((a, b) => a - b);
    const bonusNumber = row.bonus_number;
    
    // Count matching numbers
    const matchedCount = sortedNumbers.filter(num => winningNumbers.includes(num)).length;
    const hasBonus = sortedNumbers.includes(bonusNumber);
    
    let prizeType: '1등' | '2등' | '3등' | null = null;
    let prizeAmount = 0;
    
    // Check for 1st prize (6 numbers match)
    if (matchedCount === 6) {
      prizeType = '1등';
      prizeAmount = row.first_prize_amount;
    }
    // Check for 2nd prize (5 numbers + bonus)
    else if (matchedCount === 5 && hasBonus) {
      prizeType = '2등';
      prizeAmount = row.second_prize_amount;
    }
    // Check for 3rd prize (5 numbers)
    else if (matchedCount === 5) {
      prizeType = '3등';
      prizeAmount = row.third_prize_amount;
    }
    
    if (prizeType) {
      results.push({
        round: row.draw_number,
        date: row.draw_date,
        prizeType,
        prizeAmount,
        matchedNumbers: matchedCount,
        hasBonus: hasBonus && matchedCount === 5,
        winningNumbers,
        bonusNumber
      });
    }
  }

  return results;
}

export async function getAllWinningCombinations(): Promise<number[][]> {
  const { data, error } = await supabase
    .from('lotto_results')
    .select('number1, number2, number3, number4, number5, number6');

  if (error) {
    throw new Error(`Failed to fetch winning combinations: ${error.message}`);
  }

  return data.map(row => [
    row.number1 as number, 
    row.number2 as number, 
    row.number3 as number, 
    row.number4 as number, 
    row.number5 as number, 
    row.number6 as number
  ]);
}