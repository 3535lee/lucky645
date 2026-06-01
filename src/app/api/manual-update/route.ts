import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import * as cheerio from 'cheerio';

function getDrawDate(drawNumber: number): string {
  const round1 = new Date('2002-12-07');
  const date = new Date(round1.getTime() + (drawNumber - 1) * 7 * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
}

async function fetchFromNaver(round: number) {
  const query = encodeURIComponent(`${round}회 로또당첨번호`);
  const url = `https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=${query}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) throw new Error(`Naver fetch failed: ${response.status}`);

  const html = await response.text();
  const $ = cheerio.load(html);

  const balls = $('.winning_number .ball').map((_, el) => parseInt($(el).text().trim())).get();
  if (balls.length !== 6) throw new Error(`No data found for round ${round}`);

  const bonusNumber = parseInt($('.bonus_number .ball').first().text().trim());
  const winText = $('.win_text').text();
  const prizeMatch = winText.match(/([\d,]+)원/);
  const winnersMatch = winText.match(/(\d+)개/);
  const firstPrizeAmount = prizeMatch ? parseInt(prizeMatch[1].replace(/,/g, '')) : 0;

  return {
    draw_number: round,
    draw_date: getDrawDate(round),
    number1: balls[0],
    number2: balls[1],
    number3: balls[2],
    number4: balls[3],
    number5: balls[4],
    number6: balls[5],
    bonus_number: bonusNumber,
    first_prize_amount: firstPrizeAmount,
    first_prize_winners: winnersMatch ? parseInt(winnersMatch[1]) : 0,
    second_prize_amount: Math.floor(firstPrizeAmount * 0.75),
    second_prize_winners: 0,
    third_prize_amount: 1500000,
    third_prize_winners: 0
  };
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = `Bearer ${process.env.CRON_SECRET || 'default-secret'}`;

    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { round } = await request.json();

    if (!round || typeof round !== 'number') {
      return NextResponse.json({ error: 'Round number is required' }, { status: 400 });
    }

    console.log(`[ManualUpdate] Fetching data for round ${round} from Naver`);
    const lottoData = await fetchFromNaver(round);

    const client = getSupabaseClient();
    const { error } = await client
      .from('lotto_results')
      .insert([lottoData]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({
          success: false,
          message: `Round ${round} already exists in database`
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added round ${round} to database`,
      data: lottoData
    });
  } catch (error) {
    console.error('[ManualUpdate] Error:', error);
    return NextResponse.json({
      error: 'Failed to update round',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
