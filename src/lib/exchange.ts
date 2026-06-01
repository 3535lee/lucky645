import { getSupabaseClient } from './supabase';

export interface ExchangeRate {
  currency: string;
  unit: number;
  krw_per_unit: number;
  updated_at: string;
}

const NAVER_MARKET_URLS: Record<string, string> = {
  USD: 'https://finance.naver.com/marketindex/exchangeDetail.naver?marketindexCd=FX_USDKRW',
  IDR: 'https://finance.naver.com/marketindex/exchangeDetail.naver?marketindexCd=FX_IDRKRW',
};

// 네이버 환율 페이지는 EUC-KR로 인코딩되어 있음
async function fetchNaverHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!response.ok) throw new Error(`Naver fetch failed: ${response.status}`);

  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder('euc-kr');
  return decoder.decode(buffer);
}

export async function scrapeExchangeRate(currency: 'USD' | 'IDR'): Promise<{ unit: number; krw_per_unit: number } | null> {
  const url = NAVER_MARKET_URLS[currency];
  const html = await fetchNaverHtml(url);

  // IDR is quoted per 100 IDR, USD per 1 USD
  const unit = currency === 'IDR' ? 100 : 1;

  // Find "현찰 사실때" rate (the buying rate user wants)
  const cashBuyMatch = html.match(/현찰\s*사실때[\s\S]*?<td[^>]*>([\d,\.]+)\s*<\/td>/);
  if (!cashBuyMatch) return null;

  const rate = parseFloat(cashBuyMatch[1].replace(/,/g, ''));
  if (isNaN(rate) || rate <= 0) return null;

  return { unit, krw_per_unit: rate };
}

export async function updateExchangeRates(): Promise<{ success: boolean; message: string; rates?: Record<string, number> }> {
  try {
    const currencies: Array<'USD' | 'IDR'> = ['USD', 'IDR'];
    const results: Record<string, number> = {};
    const upserts: Array<{ currency: string; unit: number; krw_per_unit: number; updated_at: string }> = [];

    for (const currency of currencies) {
      const data = await scrapeExchangeRate(currency);
      if (!data) {
        console.error(`[Exchange] Failed to scrape ${currency}`);
        continue;
      }
      results[currency] = data.krw_per_unit;
      upserts.push({
        currency,
        unit: data.unit,
        krw_per_unit: data.krw_per_unit,
        updated_at: new Date().toISOString(),
      });
    }

    if (upserts.length === 0) {
      return { success: false, message: 'No rates scraped' };
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      // Fallback: use regular client (will fail if no UPDATE policy, but might work if RLS allows it)
      const client = getSupabaseClient();
      const { error } = await client.from('exchange_rates').upsert(upserts, { onConflict: 'currency' });
      if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
    } else {
      // Use service role key directly for guaranteed upsert
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const resp = await fetch(`${supabaseUrl}/rest/v1/exchange_rates?on_conflict=currency`, {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify(upserts),
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Service upsert failed ${resp.status}: ${text}`);
      }
    }

    return {
      success: true,
      message: `Updated ${upserts.length} rates: ${upserts.map(u => `${u.currency}=${u.krw_per_unit}/${u.unit}`).join(', ')}`,
      rates: results,
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getExchangeRates(): Promise<Record<string, ExchangeRate>> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('exchange_rates').select('*');
    if (error) {
      console.error('[Exchange] Failed to fetch rates:', error.message);
      return {};
    }
    const map: Record<string, ExchangeRate> = {};
    for (const row of (data as unknown as ExchangeRate[]) || []) {
      map[row.currency] = row;
    }
    return map;
  } catch (error) {
    console.error('[Exchange] Error:', error);
    return {};
  }
}
