import { NextRequest, NextResponse } from 'next/server';
import { updateLottoDatabase } from '@/lib/scraper';

export async function GET() {
  try {
    console.log('Manual crawl test triggered...');
    const result = await updateLottoDatabase();
    
    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
      timezone: 'KST',
      testMode: true
    });
  } catch (error) {
    console.error('Error in crawl-test API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        testMode: true
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET(); // Allow both GET and POST for testing
}