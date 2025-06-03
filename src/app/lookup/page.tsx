'use client';

import { useState, useEffect } from 'react';
import { getLottoResults, LottoResult } from '@/lib/supabase-client';
import LottoBall from '@/components/LottoBall';
import { formatPrizeShort, formatDateShort } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LookupPage() {
  const { t, language } = useLanguage();
  const [results, setResults] = useState<LottoResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 15; // Show 15 rounds per page for better density

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, count } = await getLottoResults(page, limit);
        setResults(data);
        setTotalCount(count);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('lookup.error_loading'));
      } finally {
        setLoading(false);
      }
    };
    
    loadResults();
  }, [page, t]);

  const totalPages = Math.ceil(totalCount / limit);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, count } = await getLottoResults(page, limit);
      setResults(data);
      setTotalCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('lookup.error_loading'));
    } finally {
      setLoading(false);
    }
  };


  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">{t('common.error')}</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button 
            onClick={fetchResults}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('lookup.title')}</h1>
        <p className="text-gray-700 dark:text-gray-300">{t('lookup.subtitle')}</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-gray-200">{t('common.loading')}</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">{t('lookup.table_round')}</th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">{t('lookup.table_date')}</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{t('lookup.table_numbers')}</th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{t('lookup.table_bonus')}</th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{t('lookup.table_first')}</th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{t('lookup.table_second')}</th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{t('lookup.table_third')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {results.map((result, index) => (
                  <tr 
                    key={result.round} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-25 dark:bg-gray-750'}`}
                  >
                    <td className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t('lookup.round_prefix')}{result.round}{t('lookup.round_suffix')}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {formatDateShort(result.date, language)}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center gap-1">
                        <LottoBall number={result.num1} size="xs" />
                        <LottoBall number={result.num2} size="xs" />
                        <LottoBall number={result.num3} size="xs" />
                        <LottoBall number={result.num4} size="xs" />
                        <LottoBall number={result.num5} size="xs" />
                        <LottoBall number={result.num6} size="xs" />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <LottoBall number={result.bonus} size="xs" isBonus />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="text-xs">
                        <div className="font-semibold text-yellow-700">{formatPrizeShort(result.first_prize, language)}</div>
                        <div className="text-gray-600 dark:text-gray-400">{result.first_winners}{t('home.winners_suffix')}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="text-xs">
                        <div className="font-semibold text-green-700">{formatPrizeShort(result.second_prize, language)}</div>
                        <div className="text-gray-600 dark:text-gray-400">{result.second_winners}{t('home.winners_suffix')}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="text-xs">
                        <div className="font-semibold text-purple-700">{formatPrizeShort(result.third_prize, language)}</div>
                        <div className="text-gray-600 dark:text-gray-400">{result.third_winners}{t('home.winners_suffix')}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {results.map((result) => (
              <div key={result.round} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('lookup.round_prefix')}{result.round}{t('lookup.round_suffix')}</h3>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{formatDateShort(result.date, language)}</span>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{t('lookup.table_numbers')}:</span>
                    <div className="flex gap-1">
                      <LottoBall number={result.num1} size="sm" />
                      <LottoBall number={result.num2} size="sm" />
                      <LottoBall number={result.num3} size="sm" />
                      <LottoBall number={result.num4} size="sm" />
                      <LottoBall number={result.num5} size="sm" />
                      <LottoBall number={result.num6} size="sm" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">+</span>
                    <LottoBall number={result.bonus} size="sm" isBonus />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                    <div className="font-semibold text-yellow-800">{t('lookup.table_first')}</div>
                    <div className="font-medium text-yellow-700">{formatPrizeShort(result.first_prize, language)}</div>
                    <div className="text-gray-600 dark:text-gray-400">{result.first_winners}{t('home.winners_suffix')}</div>
                  </div>
                  <div className="text-center bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <div className="font-semibold text-green-800">{t('lookup.table_second')}</div>
                    <div className="font-medium text-green-700">{formatPrizeShort(result.second_prize, language)}</div>
                    <div className="text-gray-600 dark:text-gray-400">{result.second_winners}{t('home.winners_suffix')}</div>
                  </div>
                  <div className="text-center bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                    <div className="font-semibold text-purple-800">{t('lookup.table_third')}</div>
                    <div className="font-medium text-purple-700">{formatPrizeShort(result.third_prize, language)}</div>
                    <div className="text-gray-600 dark:text-gray-400">{result.third_winners}{t('home.winners_suffix')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 py-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {t('common.previous')}
              </button>
              
              <span className="px-4 py-2 text-gray-900 dark:text-white font-medium">
                {t('lookup.page_info').replace('{current}', page.toString()).replace('{total}', totalPages.toString())}
              </span>
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {t('common.next')}
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t('lookup.total_rounds').replace('{count}', totalCount.toLocaleString())}
          </div>
        </>
      )}
    </div>
  );
}