// import * as cheerio from 'cheerio'; // Will be used for future scraping features
import { getSupabaseClient, getLatestRound } from './supabase';

interface ScrapedLottoData {
  draw_number: number;
  draw_date: string;
  number1: number;
  number2: number;
  number3: number;
  number4: number;
  number5: number;
  number6: number;
  bonus_number: number;
  first_prize_amount: number;
  first_prize_winners: number;
  second_prize_amount: number;
  second_prize_winners: number;
  third_prize_amount: number;
  third_prize_winners: number;
}

export async function scrapeLatestLottoData(): Promise<ScrapedLottoData | null> {
  try {
    const response = await fetch('https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=');
    
    if (!response.ok) {
      throw new Error('Failed to fetch lotto data');
    }

    const data = await response.json();
    
    if (data.returnValue !== 'success') {
      throw new Error('Invalid response from lotto API');
    }

    const formatPrize = (prizeStr: string): number => {
      return parseInt(prizeStr.replace(/,/g, ''));
    };

    return {
      draw_number: data.drwNo,
      draw_date: data.drwNoDate,
      number1: data.drwtNo1,
      number2: data.drwtNo2,
      number3: data.drwtNo3,
      number4: data.drwtNo4,
      number5: data.drwtNo5,
      number6: data.drwtNo6,
      bonus_number: data.bnusNo,
      first_prize_amount: formatPrize(data.firstWinamnt),
      first_prize_winners: data.firstPrzwnerCo,
      second_prize_amount: formatPrize(data.firstAccumamnt),
      second_prize_winners: data.secondPrzwnerCo,
      third_prize_amount: 1500000,
      third_prize_winners: data.thirdPrzwnerCo || 0
    };
  } catch (error) {
    console.error('Error scraping lotto data:', error);
    return null;
  }
}

export async function updateLottoDatabase(): Promise<{ success: boolean; message: string; newRound?: number }> {
  try {
    const latestScraped = await scrapeLatestLottoData();
    
    if (!latestScraped) {
      return { success: false, message: 'Failed to scrape latest lotto data' };
    }

    const currentLatestRound = await getLatestRound();
    
    if (latestScraped.draw_number <= currentLatestRound) {
      return { 
        success: true, 
        message: `Database is up to date. Latest round: ${currentLatestRound}` 
      };
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from('lotto_results')
      .insert([latestScraped as unknown as Record<string, unknown>]);

    if (error) {
      throw new Error(`Failed to insert new lotto data: ${error.message}`);
    }

    return {
      success: true,
      message: `Successfully added round ${latestScraped.draw_number} to database`,
      newRound: latestScraped.draw_number
    };
  } catch (error) {
    console.error('Error updating lotto database:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export function formatKoreanDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}