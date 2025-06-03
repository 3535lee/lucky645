'use client';

import { LottoResult } from '@/lib/supabase';
import { formatDate, formatPrize } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import LottoBall from './LottoBall';

interface LottoResultProps {
  result: LottoResult;
}

export default function LottoResultCard({ result }: LottoResultProps) {
  const { language } = useLanguage();
  const winningNumbers = [
    result.num1, result.num2, result.num3, 
    result.num4, result.num5, result.num6
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">제{result.round}회</h3>
        <span className="text-gray-600">{formatDate(result.date, language)}</span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">당첨번호:</span>
          <div className="flex gap-2">
            {winningNumbers.map((num, index) => (
              <LottoBall key={index} number={num} />
            ))}
          </div>
          <span className="text-sm text-gray-500 mx-2">+</span>
          <LottoBall number={result.bonus} isBonus />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-semibold text-gray-800">1등</div>
          <div className="text-blue-600 font-bold">{formatPrize(result.first_prize, language)}</div>
          <div className="text-gray-600">{result.first_winners}명</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-semibold text-gray-800">2등</div>
          <div className="text-green-600 font-bold">{formatPrize(result.second_prize, language)}</div>
          <div className="text-gray-600">{result.second_winners}명</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-semibold text-gray-800">3등</div>
          <div className="text-purple-600 font-bold">{formatPrize(result.third_prize, language)}</div>
          <div className="text-gray-600">{result.third_winners}명</div>
        </div>
      </div>
    </div>
  );
}