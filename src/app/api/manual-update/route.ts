import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import fetch from 'node-fetch';
import https from 'https';

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = `Bearer ${process.env.CRON_SECRET || 'default-secret'}`;
    
    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { round } = await request.json();
    
    if (!round || typeof round !== 'number') {
      return NextResponse.json({ error: 'Round number is required' }, { status: 400 });
    }
    
    console.log(`[ManualUpdate] Fetching data for round ${round}`);
    
    // Create HTTPS agent that bypasses SSL verification
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
    
    // Fetch round data
    const apiUrl = `https://dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
    const response = await fetch(apiUrl, {
      agent: httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.returnValue !== 'success') {
      throw new Error(`Invalid response from lottery API: ${data.returnValue}`);
    }
    
    // Format the data for database insertion
    const formatPrize = (prizeStr: string | number): number => {
      if (typeof prizeStr === 'number') return prizeStr;
      return parseInt(String(prizeStr).replace(/[,원]/g, ''));
    };
    
    const lottoData = {
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
      second_prize_amount: Math.floor(formatPrize(data.firstWinamnt) * 0.75),
      second_prize_winners: 0,
      third_prize_amount: 1500000,
      third_prize_winners: 0
    };
    
    console.log(`[ManualUpdate] Inserting round ${round} into database`);
    
    // Insert into database
    const client = getSupabaseClient();
    const { error } = await client
      .from('lotto_results')
      .insert([lottoData]);
    
    if (error) {
      // Check if it's a duplicate entry error
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

// GET method to add round 1177 immediately
export async function GET(request: NextRequest) {
  // Check if running in development or with proper auth
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET || 'default-secret'}`;
  
  if (process.env.NODE_ENV === 'production' && (!authHeader || authHeader !== expectedToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Create a POST request to add round 1177
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: {
      'authorization': expectedToken,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ round: 1177 })
  });
  
  return POST(postRequest);
}