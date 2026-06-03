import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient, getLatestRound } from '@/lib/supabase';
import { fetchVideoForRound } from '@/lib/youtube-scraper';

async function updateVideoForLatestRound() {
  const latestRound = await getLatestRound();

  const client = getServiceRoleClient();
  const { data: existing } = await client
    .from('lotto_results')
    .select('video_id')
    .eq('draw_number', latestRound)
    .single();

  if (existing?.video_id) {
    return { success: true, message: `Round ${latestRound} already has video`, round: latestRound, videoId: existing.video_id };
  }

  const videoId = await fetchVideoForRound(latestRound);
  if (!videoId) {
    return { success: false, message: `No video found for round ${latestRound}`, round: latestRound };
  }

  const { error } = await client
    .from('lotto_results')
    .update({ video_id: videoId })
    .eq('draw_number', latestRound);

  if (error) {
    throw new Error(`Failed to update video_id: ${error.message}`);
  }

  return { success: true, message: `Updated round ${latestRound} with video ${videoId}`, round: latestRound, videoId };
}

export async function GET() {
  try {
    console.log('[Cron] Lotto video update triggered');
    const result = await updateVideoForLatestRound();
    console.log('[Cron] Video update result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Cron] Error in update-lotto-video:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.CRON_SECRET;

    if (!expectedAuth || authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await updateVideoForLatestRound();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in update-lotto-video API:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
