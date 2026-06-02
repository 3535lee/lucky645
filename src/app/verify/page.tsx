'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { checkWinningNumbers, getLatestRoundInfo, WinningResult } from '@/lib/supabase-client';
import LottoBall from '@/components/LottoBall';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

function fireConfetti() {
  const duration = 1500;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }
    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 }, colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA'] });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }, colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA'] });
  }, 250);
}

export default function VerifyPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [numbers, setNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [results, setResults] = useState<WinningResult[]>([]);
  const [searched, setSearched] = useState<number[]>([]);
  const [latestInfo, setLatestInfo] = useState<{ round: number; date: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Contact / recommendation buttons only apply to non-Korean (EN/ID) pages.
  const showButtons = language !== 'ko';

  const handleNumberChange = (index: number, value: string) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);

    if (hasSearched) {
      setHasSearched(false);
      setResults([]);
      setError(null);
    }
  };

  const isAllNumbersEntered = () => numbers.every(n => n !== '' && !isNaN(parseInt(n)));

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
      const [winningResults, latest] = await Promise.all([
        checkWinningNumbers(sortedNumbers),
        getLatestRoundInfo(),
      ]);
      setResults(winningResults);
      setSearched(sortedNumbers);
      setLatestInfo(latest);
      setHasSearched(true);

      const wonLatest = !!latest && winningResults.some(r => r.round === latest.round);
      if (wonLatest) fireConfetti();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('verify.verification_failed'));
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setNumbers(['', '', '', '', '', '']);
    setResults([]);
    setSearched([]);
    setLatestInfo(null);
    setError(null);
    setHasSearched(false);
  };

  const tierLabel = (prizeType: WinningResult['prizeType']) =>
    prizeType === '1등' ? t('verify.tier_first') : prizeType === '2등' ? t('verify.tier_second') : t('verify.tier_third');

  const tierBadgeClass = (prizeType: WinningResult['prizeType']) =>
    prizeType === '1등'
      ? 'bg-yellow-100 text-yellow-800'
      : prizeType === '2등'
        ? 'bg-green-100 text-green-800'
        : 'bg-purple-100 text-purple-800';

  const goToContact = () => {
    if (!latestInfo) return;
    const message = t('verify.contact_message')
      .replace('{numbers}', searched.join(', '))
      .replace('{round}', latestInfo.round.toString())
      .replace('{date}', formatDate(latestInfo.date, language));
    sessionStorage.setItem('contact_prefill_message', message);
    router.push('/contact');
  };

  const latestWin = latestInfo ? results.find(r => r.round === latestInfo.round) ?? null : null;
  const earlierWins = latestInfo ? results.filter(r => r.round !== latestInfo.round) : results;
  const wonLatest = !!latestWin;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('verify.title')}</h1>
        <p className="text-gray-700 dark:text-gray-300">{t('verify.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
              {t('verify.input_label')}
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {numbers.map((number, index) => (
                <input
                  key={index}
                  type="number"
                  min="1"
                  max="45"
                  value={number}
                  onChange={(e) => handleNumberChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-center text-gray-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 min-w-[3rem]"
                  placeholder={t('verify.input_placeholder').replace('{number}', (index + 1).toString())}
                />
              ))}
            </div>
          </div>

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

      {hasSearched && (
        <div className="space-y-6">
          {/* Latest draw win → celebrate */}
          {wonLatest && latestWin && latestInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-600 mb-3">{t('verify.latest_win_title')}</h3>
              <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">
                {t('verify.latest_win_desc')
                  .replace('{date}', formatDate(latestInfo.date, language))
                  .replace('{round}', latestInfo.round.toString())
                  .replace('{tier}', tierLabel(latestWin.prizeType))}
              </p>
              <div className="flex justify-center flex-wrap gap-1.5 mb-6">
                {searched.map((num, i) => (
                  <LottoBall key={i} number={num} size="sm" />
                ))}
              </div>
              {showButtons && (
                <button
                  onClick={goToContact}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 px-8 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 font-bold text-lg"
                >
                  🎰 {t('verify.contact_button')}
                </button>
              )}
            </div>
          )}

          {/* No win in the latest draw */}
          {!wonLatest && earlierWins.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-5xl mb-4">🍀</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('verify.no_win_latest_title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('verify.no_win_latest_desc')}</p>
            </div>
          )}

          {/* Past-round wins (informational, no celebration) */}
          {earlierWins.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('verify.past_win_title')}</h3>
              <ul className="space-y-2">
                {earlierWins.map((w, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-md px-4 py-3"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t('verify.round_prefix')}{w.round}{t('verify.round_suffix')}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{formatDate(w.date, language)}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${tierBadgeClass(w.prizeType)}`}>
                      {tierLabel(w.prizeType)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Not a latest-draw winner → offer fresh numbers (EN/ID only) */}
          {!wonLatest && showButtons && (
            <div className="text-center">
              <button
                onClick={() => router.push('/recommend')}
                className="inline-block bg-blue-600 text-white py-3 px-8 rounded-full shadow-lg hover:scale-105 hover:bg-blue-700 transition-all duration-200 font-bold text-lg"
              >
                {t('verify.recommend_button')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
