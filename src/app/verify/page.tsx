'use client';

import { useState } from 'react';
import { checkWinningNumbers, WinningResult } from '@/lib/supabase-client';
import LottoBall from '@/components/LottoBall';
import { formatDate, formatPrize } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VerifyPage() {
  const { t, language } = useLanguage();
  const [numbers, setNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [results, setResults] = useState<WinningResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleNumberChange = (index: number, value: string) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
    
    // Reset search state when numbers change
    if (hasSearched) {
      setHasSearched(false);
      setResults([]);
      setError(null);
    }
  };

  const isAllNumbersEntered = () => {
    return numbers.every(n => n !== '' && !isNaN(parseInt(n)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numArray = numbers.map(n => parseInt(n)).filter(n => !isNaN(n));
    
    if (numArray.length !== 6) {
      setError(t('verify.enter_all_numbers'));
      return;
    }

    if (numArray.some(n => n < 1 || n > 45)) {
      setError(t('verify.invalid_range'));
      return;
    }

    if (new Set(numArray).size !== 6) {
      setError(t('verify.duplicate_numbers'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(false);
      const sortedNumbers = [...numArray].sort((a, b) => a - b);
      const winningResults = await checkWinningNumbers(sortedNumbers);
      setResults(winningResults);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('verify.verification_failed'));
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setNumbers(['', '', '', '', '', '']);
    setResults([]);
    setError(null);
    setHasSearched(false);
  };


  const getPrizeColor = (prizeType: string) => {
    switch (prizeType) {
      case '1등': return 'yellow';
      case '2등': return 'green';
      case '3등': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('verify.title')}</h1>
        <p className="text-gray-700 dark:text-gray-300">{t('verify.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-3">
              {t('verify.input_label')}
            </label>
            <div className="grid grid-cols-6 gap-3">
              {numbers.map((number, index) => (
                <input
                  key={index}
                  type="number"
                  min="1"
                  max="45"
                  value={number}
                  onChange={(e) => handleNumberChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-center text-gray-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                  placeholder={t('verify.input_placeholder').replace('{number}', (index + 1).toString())}
                />
              ))}
            </div>
          </div>

          {/* Show validation error or incomplete input message */}
          {!isAllNumbersEntered() && !hasSearched && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-blue-600 text-sm">{t('verify.enter_all_numbers')}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !isAllNumbersEntered()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('verify.button_verifying') : t('verify.button_verify')}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              {t('common.clear')}
            </button>
          </div>
        </form>
      </div>

      {/* Show results only after search is complete */}
      {hasSearched && (
        <div className="bg-white rounded-lg shadow-md p-6 border">
          {results.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-green-600 mb-2">{t('verify.no_wins_title')}</h3>
              <p className="text-gray-600">{t('verify.no_wins_desc')}</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-4">
                {t('verify.has_wins_title').replace('{count}', results.length.toString())}
              </h3>
              <div className="space-y-4">
                {results.map((result, index) => {
                  const color = getPrizeColor(result.prizeType);
                  return (
                    <div 
                      key={index} 
                      className={`bg-${color}-50 p-4 rounded-lg border-l-4 border-${color}-400`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-bold text-${color}-800`}>
                              {t('verify.round_prefix')}{result.round}{t('verify.round_suffix')}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold bg-${color}-200 text-${color}-800 rounded`}>
                              {result.prizeType}
                            </span>
                          </div>
                          <div className={`text-${color}-700 text-sm`}>
                            {result.prizeType === '1등' && t('verify.prize_first').replace('{count}', result.matchedNumbers.toString()).replace('{amount}', formatPrize(result.prizeAmount, language))}
                            {result.prizeType === '2등' && t('verify.prize_second').replace('{count}', result.matchedNumbers.toString()).replace('{amount}', formatPrize(result.prizeAmount, language))}
                            {result.prizeType === '3등' && t('verify.prize_third').replace('{count}', result.matchedNumbers.toString()).replace('{amount}', formatPrize(result.prizeAmount, language))}
                          </div>
                        </div>
                        <span className={`text-${color}-600 text-sm`}>
                          {formatDate(result.date, language)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{t('verify.winning_numbers_label')}</span>
                        <div className="flex gap-1">
                          {result.winningNumbers.map((num, i) => (
                            <LottoBall key={i} number={num} size="sm" />
                          ))}
                        </div>
                        {result.hasBonus && (
                          <>
                            <span className="text-sm text-gray-500 mx-1">+</span>
                            <LottoBall number={result.bonusNumber} size="sm" isBonus />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}