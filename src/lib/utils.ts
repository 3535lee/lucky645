export function getBallColor(number: number): string {
  if (number >= 1 && number <= 10) return 'bg-yellow-400 text-black';
  if (number >= 11 && number <= 20) return 'bg-blue-500 text-white';
  if (number >= 21 && number <= 30) return 'bg-red-500 text-white';
  if (number >= 31 && number <= 40) return 'bg-gray-500 text-white';
  if (number >= 41 && number <= 45) return 'bg-green-500 text-white';
  return 'bg-gray-300 text-black';
}

export function generateRandomNumbers(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function generateNeverWonNumbers(winningCombinations: number[][]): number[] {
  // Convert winning combinations to Set of strings for O(1) lookup
  const winningSet = new Set(
    winningCombinations.map(combo => 
      [...combo].sort((a, b) => a - b).join(',')
    )
  );
  
  let attempts = 0;
  const maxAttempts = 500; // Reduced for better performance
  
  while (attempts < maxAttempts) {
    const candidate = generateRandomNumbers();
    const candidateKey = candidate.join(','); // Already sorted from generateRandomNumbers
    
    if (!winningSet.has(candidateKey)) {
      return candidate;
    }
    attempts++;
  }
  
  // If we can't find a non-winning combination, return a random one
  return generateRandomNumbers();
}

export function perWinnerAmount(totalAmount: number, winners: number): number {
  if (!winners || winners <= 0) return totalAmount;
  return Math.floor(totalAmount / winners);
}

interface ExchangeRate {
  unit: number;
  krw_per_unit: number;
}

// Convert KRW amount to target currency using "현찰 사실때" (buying) rate
// rate.krw_per_unit = KRW for `rate.unit` of target currency
// e.g. USD: unit=1, krw_per_unit=1541.81 → 1 USD = 1541.81 KRW
// e.g. IDR: unit=100, krw_per_unit=9.32 → 100 IDR = 9.32 KRW
function convertKrw(krwAmount: number, rate: ExchangeRate): number {
  if (!rate || !rate.krw_per_unit) return krwAmount;
  return (krwAmount * rate.unit) / rate.krw_per_unit;
}

export function formatPrize(amount: number, language: string = 'ko', rates?: Record<string, ExchangeRate>): string {
  if (language === 'ko') {
    if (amount >= 100000000) {
      return `${Math.floor(amount / 100000000)}억${amount % 100000000 ? Math.floor((amount % 100000000) / 10000) + '만' : ''}원`;
    }
    if (amount >= 10000) {
      return `${Math.floor(amount / 10000)}만원`;
    }
    return `${amount.toLocaleString()}원`;
  }

  if (language === 'en' && rates?.USD) {
    const usd = convertKrw(amount, rates.USD);
    return `$${Math.round(usd).toLocaleString('en-US')}`;
  }

  if (language === 'id' && rates?.IDR) {
    const idr = convertKrw(amount, rates.IDR);
    return `Rp ${Math.round(idr).toLocaleString('id-ID')}`;
  }

  // Fallback to KRW if no rate available
  return `${amount.toLocaleString()} KRW`;
}

export function formatPrizeShort(amount: number, language: string = 'ko', rates?: Record<string, ExchangeRate>): string {
  if (language === 'ko') {
    if (amount >= 100000000) {
      const billions = Math.floor(amount / 100000000);
      const remainder = Math.floor((amount % 100000000) / 10000000);
      return remainder > 0 ? `${billions}.${remainder}억` : `${billions}억`;
    }
    if (amount >= 10000000) {
      return `${Math.floor(amount / 10000000)}천만`;
    }
    if (amount >= 10000) {
      return `${Math.floor(amount / 10000)}만`;
    }
    return `${Math.floor(amount / 1000)}천`;
  }

  if (language === 'en' && rates?.USD) {
    const usd = convertKrw(amount, rates.USD);
    if (usd >= 1000000) return `$${(usd / 1000000).toFixed(1)}M`;
    if (usd >= 1000) return `$${(usd / 1000).toFixed(0)}K`;
    return `$${Math.round(usd)}`;
  }

  if (language === 'id' && rates?.IDR) {
    const idr = convertKrw(amount, rates.IDR);
    if (idr >= 1000000000) return `Rp ${(idr / 1000000000).toFixed(1)}M`; // miliar
    if (idr >= 1000000) return `Rp ${(idr / 1000000).toFixed(1)}jt`; // juta
    if (idr >= 1000) return `Rp ${(idr / 1000).toFixed(0)}rb`; // ribu
    return `Rp ${Math.round(idr)}`;
  }

  // Fallback
  if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B KRW`;
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M KRW`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K KRW`;
  return `${amount} KRW`;
}

export function formatDate(dateString: string, language: string = 'ko'): string {
  const date = new Date(dateString);
  
  switch (language) {
    case 'en':
      // US format: Month DD, YYYY (e.g., January 15, 2024)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'id':
      // Indonesian format: DD Month YYYY (e.g., 15 Januari 2024)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    default: // 'ko'
      // Korean format: YYYY년 M월 D일 (e.g., 2024년 1월 15일)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  }
}

export function formatDateShort(dateString: string, language: string = 'ko'): string {
  const date = new Date(dateString);
  
  switch (language) {
    case 'en':
      // US short format: MM/DD/YYYY (e.g., 01/15/2024)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    case 'id':
      // Indonesian short format: DD/MM/YYYY (e.g., 15/01/2024)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    default: // 'ko'
      // Korean short format: YYYY.MM.DD (e.g., 2024.01.15)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '.');
  }
}