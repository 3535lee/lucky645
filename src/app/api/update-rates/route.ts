import { NextResponse } from 'next/server';
import { updateExchangeRates } from '@/lib/exchange';

export async function GET() {
  try {
    console.log('[Rates] Update triggered at', new Date().toISOString());
    const result = await updateExchangeRates();
    console.log('[Rates] Result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Rates] Error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
