import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// The service-role RPC writes and deletes one isolated probe in a transaction.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('[Keepalive] CRON_SECRET is not configured');
    return NextResponse.json({ success: false }, { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const { error } = await getServiceRoleClient().rpc('lucky645_keepalive_write');
    if (error) throw error;

    console.log('[Keepalive] Probe inserted and deleted successfully');
    return NextResponse.json({ success: true, at: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[Keepalive] Probe failed:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
