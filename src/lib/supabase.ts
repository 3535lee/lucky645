import { createClient } from '@supabase/supabase-js';
import { validateEnv, EnvError } from './env-check';

let supabase: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabase) {
    try {
      const env = validateEnv();
      supabase = createClient(env.supabaseUrl, env.supabaseKey);
    } catch (error) {
      if (error instanceof EnvError) {
        throw error;
      }
      throw new Error('Failed to initialize Supabase client');
    }
  }
  return supabase;
}

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

export async function getLottoResults(page = 1, limit = 20) {
  const client = getSupabaseClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await client
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

export async function getLatestRound(): Promise<number> {
  const client = getSupabaseClient();
  
  const { data, error } = await client
    .from('lotto_results')
    .select('draw_number')
    .order('draw_number', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw new Error(`Failed to fetch latest round: ${error.message}`);
  }

  return data.draw_number as number;
}

export async function getLatestResult(): Promise<LottoResult | null> {
  const client = getSupabaseClient();
  
  const { data, error } = await client
    .from('lotto_results')
    .select('*')
    .order('draw_number', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw new Error(`Failed to fetch latest result: ${error.message}`);
  }

  return mapSupabaseRowToLottoResult(data as SupabaseRow);
}

export async function checkWinningNumbers(numbers: number[]) {
  if (numbers.length !== 6) {
    throw new Error('Please provide exactly 6 numbers');
  }

  const client = getSupabaseClient();
  
  const { data, error } = await client
    .from('lotto_results')
    .select('draw_number, draw_date, number1, number2, number3, number4, number5, number6')
    .eq('number1', numbers[0])
    .eq('number2', numbers[1])
    .eq('number3', numbers[2])
    .eq('number4', numbers[3])
    .eq('number5', numbers[4])
    .eq('number6', numbers[5]);

  if (error) {
    throw new Error(`Failed to check winning numbers: ${error.message}`);
  }

  return data.map(row => ({
    round: row.draw_number as number,
    date: row.draw_date as string,
    num1: row.number1 as number,
    num2: row.number2 as number,
    num3: row.number3 as number,
    num4: row.number4 as number,
    num5: row.number5 as number,
    num6: row.number6 as number,
  }));
}

export async function getAllWinningCombinations(): Promise<number[][]> {
  const client = getSupabaseClient();
  
  const { data, error } = await client
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