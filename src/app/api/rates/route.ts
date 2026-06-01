import { NextResponse } from 'next/server';
import { getExchangeRates } from '@/lib/exchange';

export async function GET() {
  try {
    const ratesMap = await getExchangeRates();
    const rates: Record<string, { unit: number; krw_per_unit: number }> = {};
    for (const [currency, rate] of Object.entries(ratesMap)) {
      rates[currency] = {
        unit: rate.unit,
        krw_per_unit: Number(rate.krw_per_unit),
      };
    }
    return NextResponse.json({ rates });
  } catch (error) {
    return NextResponse.json(
      { rates: {}, error: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
