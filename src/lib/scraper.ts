import * as cheerio from 'cheerio';
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

// Round 1 was 2002-12-07, each round is 7 days apart
function getDrawDate(drawNumber: number): string {
  const round1 = new Date('2002-12-07');
  const date = new Date(round1.getTime() + (drawNumber - 1) * 7 * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
}

async function scrapeFromNaver(drawNumber: number): Promise<ScrapedLottoData | null> {
  const query = encodeURIComponent(`${drawNumber}회 로또당첨번호`);
  const url = `https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=${query}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Naver fetch failed: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Verify the displayed round matches what we requested
  const pageText = $.html();
  const roundMatch = pageText.match(/(\d+)회차\s*\(/);
  if (roundMatch && parseInt(roundMatch[1]) !== drawNumber) {
    console.log(`[Scraper] Round mismatch: requested ${drawNumber}, page shows ${roundMatch[1]}`);
    return null;
  }

  const balls = $('.winning_number .ball');
  if (balls.length !== 6) {
    console.log(`[Scraper] No winning numbers found for round ${drawNumber} (found ${balls.length} balls)`);
    return null;
  }

  const numbers = balls.map((_, el) => parseInt($(el).text().trim())).get();
  const bonusBall = $('.bonus_number .ball');
  if (bonusBall.length === 0) return null;
  const bonusNumber = parseInt(bonusBall.first().text().trim());

  const winText = $('.win_text').text();
  const prizeMatch = winText.match(/([\d,]+)원/);
  const winnersMatch = winText.match(/(\d+)개/);

  const firstPrizeAmount = prizeMatch ? parseInt(prizeMatch[1].replace(/,/g, '')) : 0;
  const firstPrizeWinners = winnersMatch ? parseInt(winnersMatch[1]) : 0;

  // Parse 2nd/3rd prize from the prize amount table
  let secondPrizeAmount = 0;
  let secondPrizeWinners = 0;
  let thirdPrizeAmount = 0;
  let thirdPrizeWinners = 0;

  const parseNum = (s: string) => parseInt(s.replace(/[,개원\s]/g, '')) || 0;

  $('th[scope="row"]').each((_, th) => {
    const grade = $(th).text().trim();
    if (grade !== '2등' && grade !== '3등') return;

    const row = $(th).closest('tr');
    const siblings = row.nextUntil('tr.first_line');
    let winners = 0;
    let perPrize = 0;

    siblings.each((__, sib) => {
      const label = $(sib).find('td').first().text().trim();
      const value = $(sib).find('td').last().text().trim();
      if (label === '당첨 복권수') winners = parseNum(value);
      if (label === '1개당 당첨금') perPrize = parseNum(value);
    });

    if (grade === '2등') {
      secondPrizeAmount = perPrize;
      secondPrizeWinners = winners;
    } else {
      thirdPrizeAmount = perPrize;
      thirdPrizeWinners = winners;
    }
  });

  return {
    draw_number: drawNumber,
    draw_date: getDrawDate(drawNumber),
    number1: numbers[0],
    number2: numbers[1],
    number3: numbers[2],
    number4: numbers[3],
    number5: numbers[4],
    number6: numbers[5],
    bonus_number: bonusNumber,
    first_prize_amount: firstPrizeAmount,
    first_prize_winners: firstPrizeWinners,
    second_prize_amount: secondPrizeAmount,
    second_prize_winners: secondPrizeWinners,
    third_prize_amount: thirdPrizeAmount,
    third_prize_winners: thirdPrizeWinners
  };
}

export async function scrapeLatestLottoData(): Promise<ScrapedLottoData | null> {
  try {
    console.log('[Scraper] Starting lottery data search at', new Date().toISOString());

    const currentLatestRound = await getLatestRound();
    console.log(`[Scraper] Current database latest round: ${currentLatestRound}`);

    let latestDrawNumber = currentLatestRound;

    for (let checkRound = currentLatestRound + 1; checkRound <= currentLatestRound + 5; checkRound++) {
      console.log(`[Scraper] Checking round ${checkRound} on Naver...`);
      try {
        const result = await scrapeFromNaver(checkRound);
        if (result) {
          latestDrawNumber = checkRound;
          console.log(`[Scraper] Found new round: ${checkRound}`);
        } else {
          break;
        }
      } catch (error) {
        console.log(`[Scraper] Round ${checkRound} not available:`, error instanceof Error ? error.message : 'Unknown error');
        break;
      }
    }

    if (latestDrawNumber === currentLatestRound) {
      console.log('[Scraper] No new rounds found - database is up to date');
      return null;
    }

    console.log(`[Scraper] Latest draw number found: ${latestDrawNumber}`);
    return scrapeFromNaver(latestDrawNumber);
  } catch (error) {
    console.error('[Scraper] Error scraping lotto data:', error);
    return null;
  }
}

export async function updateLottoDatabase(): Promise<{ success: boolean; message: string; newRound?: number }> {
  try {
    console.log('[UpdateDB] Starting lottery database update at', new Date().toISOString());
    const startTime = Date.now();

    const currentLatestRound = await getLatestRound();
    let insertedCount = 0;
    let lastInsertedRound = currentLatestRound;

    // Insert all missing rounds, not just the latest
    for (let round = currentLatestRound + 1; round <= currentLatestRound + 30; round++) {
      const scraped = await scrapeFromNaver(round);
      if (!scraped) break;

      console.log(`[UpdateDB] Inserting round ${round}...`);
      const client = getSupabaseClient();
      const { error } = await client
        .from('lotto_results')
        .insert([scraped as unknown as Record<string, unknown>]);

      if (error) {
        console.error(`[UpdateDB] Failed to insert round ${round}:`, error.message);
        break;
      }

      insertedCount++;
      lastInsertedRound = round;
    }

    const duration = Date.now() - startTime;

    if (insertedCount === 0) {
      const message = `Database is already up to date with round ${currentLatestRound}`;
      console.log('[UpdateDB]', message);
      return { success: true, message };
    }

    const successMessage = `Added ${insertedCount} rounds (${currentLatestRound + 1} ~ ${lastInsertedRound}) in ${duration}ms`;
    console.log('[UpdateDB]', successMessage);
    return { success: true, message: successMessage, newRound: lastInsertedRound };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[UpdateDB] Error:', error);
    return { success: false, message: errorMsg };
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
