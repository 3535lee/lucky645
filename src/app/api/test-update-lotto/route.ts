import { NextRequest, NextResponse } from 'next/server';
import { getLatestRound } from '@/lib/supabase';
import fetch from 'node-fetch';
import https from 'https';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    console.log('[TestAPI] Test endpoint called at', new Date().toISOString());
    
    // Get current database state
    const currentRound = await getLatestRound();
    console.log('[TestAPI] Current database round:', currentRound);
    
    // Create HTTPS agent that bypasses SSL verification
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
    
    // Try to fetch the next round
    const nextRound = currentRound + 1;
    const testUrl = `https://dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${nextRound}`;
    
    console.log('[TestAPI] Attempting to fetch round:', nextRound);
    console.log('[TestAPI] URL:', testUrl);
    
    let fetchResult;
    let fetchError;
    
    try {
      const response = await fetch(testUrl, {
        agent: httpsAgent,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const data = await response.json();
      fetchResult = {
        status: response.status,
        statusText: response.statusText,
        data: data
      };
      
      console.log('[TestAPI] Fetch successful:', fetchResult);
    } catch (error) {
      fetchError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      };
      console.error('[TestAPI] Fetch failed:', fetchError);
    }
    
    // Check specific round 1177
    let round1177Result;
    try {
      const round1177Url = `https://dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=1177`;
      const response1177 = await fetch(round1177Url, {
        agent: httpsAgent,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const data1177 = await response1177.json();
      round1177Result = {
        status: response1177.status,
        data: data1177
      };
      console.log('[TestAPI] Round 1177 fetch result:', round1177Result);
    } catch (error) {
      round1177Result = {
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Prepare response
    const response = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      currentDatabaseRound: currentRound,
      nextRoundCheck: {
        round: nextRound,
        url: testUrl,
        result: fetchResult,
        error: fetchError
      },
      round1177Check: round1177Result,
      diagnostics: {
        nodeVersion: process.version,
        platform: process.platform,
        vercelRegion: process.env.VERCEL_REGION || 'not-on-vercel',
        isVercel: !!process.env.VERCEL
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('[TestAPI] Unexpected error:', error);
    return NextResponse.json({
      error: 'Test endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// Also support POST for manual testing with authentication
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET || 'default-secret'}`;
  
  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return GET(request);
}