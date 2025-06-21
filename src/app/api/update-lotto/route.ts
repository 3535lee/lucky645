import { NextRequest, NextResponse } from 'next/server';
import { updateLottoDatabase } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.CRON_SECRET;
    
    if (!expectedAuth || authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await updateLottoDatabase();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in update-lotto API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('[Cron] Lottery update cron job triggered at 22:00 KST');
    console.log('[Cron] Timestamp:', new Date().toISOString());
    console.log('[Cron] Environment:', process.env.NODE_ENV || 'development');
    
    const result = await updateLottoDatabase();
    
    console.log('[Cron] Job completed with result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Cron] Error in update-lotto cron:', error);
    console.error('[Cron] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}