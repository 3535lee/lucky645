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