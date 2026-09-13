import { NextResponse } from 'next/server';
import { getLatestRound } from '@/lib/supabase';

// Supabase keep-alive / 수동 헬스체크용 엔드포인트.
// 읽기 전용 SELECT 1건(latest round)만 수행한다.
// Workers Cron이 주 수단이며, 이 라우트는 수동 확인·외부 핑 백업용이다.
export async function GET() {
  try {
    const round = await getLatestRound();
    return NextResponse.json({
      success: true,
      latestRound: round,
      at: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
