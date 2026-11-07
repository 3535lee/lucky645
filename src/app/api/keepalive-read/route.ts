import { NextRequest, NextResponse } from 'next/server';
import { getLatestRound } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Query the actual database on every invocation, including Saturdays.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('[KeepaliveRead] CRON_SECRET is not configured');
    return NextResponse.json({ success: false }, { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const latestRound = await getLatestRound();
    console.log('[KeepaliveRead] Latest round:', latestRound);
    return NextResponse.json({ success: true, latestRound, at: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[KeepaliveRead] Query failed:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
