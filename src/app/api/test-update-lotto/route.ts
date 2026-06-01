import { NextRequest, NextResponse } from 'next/server';
import { getLatestRound } from '@/lib/supabase';
import * as cheerio from 'cheerio';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    console.log('[TestAPI] Test endpoint called at', new Date().toISOString());

    const currentRound = await getLatestRound();
    const nextRound = currentRound + 1;
    const query = encodeURIComponent(`${nextRound}회 로또당첨번호`);
    const testUrl = `https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=${query}`;

    let fetchResult;
    let fetchError;

    try {
      const response = await fetch(testUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      const html = await response.text();
      const $ = cheerio.load(html);
      const balls = $('.winning_number .ball').map((_, el) => parseInt($(el).text().trim())).get();
      const bonus = parseInt($('.bonus_number .ball').first().text().trim()) || null;
      const winText = $('.win_text').text();

      fetchResult = {
        status: response.status,
        numbers: balls,
        bonus,
        winText: winText || 'not found',
        hasData: balls.length === 6
      };
    } catch (error) {
      fetchError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error
      };
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      currentDatabaseRound: currentRound,
      nextRoundCheck: {
        round: nextRound,
        source: 'naver',
        url: testUrl,
        result: fetchResult,
        error: fetchError
      },
      diagnostics: {
        nodeVersion: process.version,
        platform: process.platform,
        vercelRegion: process.env.VERCEL_REGION || 'not-on-vercel',
        isVercel: !!process.env.VERCEL
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Test endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET || 'default-secret'}`;

  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return GET(request);
}
