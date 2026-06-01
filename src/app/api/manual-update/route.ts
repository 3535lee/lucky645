import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { scrapeFromNaver } from '@/lib/scraper';

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
    const lottoData = await scrapeFromNaver(round);

    if (!lottoData) {
      return NextResponse.json({
        success: false,
        message: `No data found for round ${round}`
      }, { status: 404 });
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from('lotto_results')
      .insert([lottoData as unknown as Record<string, unknown>]);

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
