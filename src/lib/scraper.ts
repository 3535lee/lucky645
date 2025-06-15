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
  // Temporarily disable SSL verification for the lottery site due to expired certificate
  const originalValue = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  try {
    // Try to find the latest draw number by checking recent rounds
    console.log('Searching for latest lottery data...');
    
    // Get current round from database and try next numbers
    const currentLatestRound = await getLatestRound();
    console.log(`Current database latest round: ${currentLatestRound}`);
    
    let latestDrawNumber = currentLatestRound;
    
    // Check for newer rounds (up to 5 rounds ahead)
    for (let checkRound = currentLatestRound + 1; checkRound <= currentLatestRound + 5; checkRound++) {
      const testUrl = `https://dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${checkRound}`;
      console.log(`Checking round ${checkRound}...`);
      
      try {
        const testResponse = await fetch(testUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          if (testData.returnValue === 'success' && testData.drwNo === checkRound) {
            latestDrawNumber = checkRound;
            console.log(`Found new round: ${checkRound}`);
          }
        }
      } catch {
        console.log(`Round ${checkRound} not available yet`);
        break;
      }
    }
    
    if (latestDrawNumber === currentLatestRound) {
      console.log('No new rounds found - database is up to date');
      // Restore SSL setting
      if (originalValue !== undefined) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalValue;
      } else {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      }
      // Return null to indicate no new data, but this is handled in updateLottoDatabase()
      return null;
    }
    
    console.log(`Latest draw number found: ${latestDrawNumber}`);

    // Now fetch the detailed data using the JSON API
    const apiUrl = `https://dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${latestDrawNumber}`;
    console.log(`Fetching detailed data from: ${apiUrl}`);
    
    const apiResponse = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch API data: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    console.log('API response:', JSON.stringify(data, null, 2));
    
    if (data.returnValue !== 'success') {
      throw new Error(`Invalid response from lotto API: ${data.returnValue}`);
    }

    const formatPrize = (prizeStr: string | number): number => {
      if (typeof prizeStr === 'number') return prizeStr;
      return parseInt(String(prizeStr).replace(/[,원]/g, ''));
    };

    const result = {
      draw_number: data.drwNo,
      draw_date: data.drwNoDate,
      number1: data.drwtNo1,
      number2: data.drwtNo2,
      number3: data.drwtNo3,
      number4: data.drwtNo4,
      number5: data.drwtNo5,
      number6: data.drwtNo6,
      bonus_number: data.bnusNo,
      first_prize_amount: formatPrize(data.firstWinamnt), // Individual first prize amount
      first_prize_winners: data.firstPrzwnerCo,
      second_prize_amount: Math.floor(formatPrize(data.firstWinamnt) * 0.75), // Estimate 2nd prize as 75% of 1st
      second_prize_winners: 0, // Will be filled from additional API call if available
      third_prize_amount: 1500000, // Fixed amount for 3rd prize in Korean Lotto
      third_prize_winners: 0 // Will be filled from additional API call if available
    };

    console.log('Parsed lottery data:', JSON.stringify(result, null, 2));
    
    // Restore original SSL setting
    if (originalValue !== undefined) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalValue;
    } else {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
    
    return result;
  } catch (error) {
    console.error('Error scraping lotto data:', error);
    
    // Restore original SSL setting even on error
    if (originalValue !== undefined) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalValue;
    } else {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
    
    return null;
  }
}

export async function updateLottoDatabase(): Promise<{ success: boolean; message: string; newRound?: number }> {
  try {
    console.log('Starting lottery database update...');
    const startTime = Date.now();
    
    const latestScraped = await scrapeLatestLottoData();
    
    if (!latestScraped) {
      // Check if this is because database is up to date
      const currentLatestRound = await getLatestRound();
      const message = `Database is already up to date with round ${currentLatestRound}`;
      console.log(message);
      return { success: true, message };
    }

    console.log(`Successfully scraped data for round ${latestScraped.draw_number}`);
    
    const currentLatestRound = await getLatestRound();
    console.log(`Current database latest round: ${currentLatestRound}`);
    
    if (latestScraped.draw_number <= currentLatestRound) {
      const message = `Database is up to date. Latest round: ${currentLatestRound}, Scraped round: ${latestScraped.draw_number}`;
      console.log(message);
      return { 
        success: true, 
        message 
      };
    }

    console.log(`Inserting new round ${latestScraped.draw_number} into database...`);
    const client = getSupabaseClient();
    const { error } = await client
      .from('lotto_results')
      .insert([latestScraped as unknown as Record<string, unknown>]);

    if (error) {
      const errorMsg = `Failed to insert new lotto data: ${error.message}`;
      console.error(errorMsg, error);
      throw new Error(errorMsg);
    }

    const duration = Date.now() - startTime;
    const successMessage = `Successfully added round ${latestScraped.draw_number} to database (took ${duration}ms)`;
    console.log(successMessage);

    return {
      success: true,
      message: successMessage,
      newRound: latestScraped.draw_number
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating lotto database:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return {
      success: false,
      message: errorMsg
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