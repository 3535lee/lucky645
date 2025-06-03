'use client';

import { useState } from 'react';
import { getAllWinningCombinations } from '@/lib/supabase-client';
import { generateNeverWonNumbers } from '@/lib/utils';
import LottoBall from '@/components/LottoBall';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RecommendPage() {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState<number[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsTimeout(false);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 4000); // 4 second timeout
      });
      
      // Create the generation promise
      const generationPromise = (async () => {
        const winningCombinations = await getAllWinningCombinations();
        const newRecommendations: number[][] = [];
        
        for (let i = 0; i < 5; i++) {
          const numbers = generateNeverWonNumbers(winningCombinations);
          newRecommendations.push(numbers);
        }
        
        return newRecommendations;
      })();
      
      // Race between generation and timeout
      const result = await Promise.race([generationPromise, timeoutPromise]) as number[][];
      setRecommendations(result);
      
    } catch (err) {
      if (err instanceof Error && err.message === 'timeout') {
        setIsTimeout(true);
        setError(t('recommend.generation_timeout'));
      } else {
        setError(err instanceof Error ? err.message : t('recommend.generation_failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('recommend.title')}</h1>
        <p className="text-gray-700 dark:text-gray-300">{t('recommend.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <button
            onClick={generateRecommendations}
            disabled={loading}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('recommend.button_generating')}
              </div>
            ) : t('recommend.button_generate')}
          </button>
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>{t('recommend.note_disclaimer')}</p>
            <p>{t('recommend.note_no_guarantee')}</p>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-4">
            <p className="text-red-600 dark:text-red-300">{error}</p>
            {isTimeout && (
              <button
                onClick={generateRecommendations}
                disabled={loading}
                className="mt-3 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                {t('recommend.button_retry')}
              </button>
            )}
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            {t('recommend.recommendation_title')}
          </h2>
          
          <div className="grid gap-4">
            {recommendations.map((numbers, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <span className="text-lg font-bold text-gray-700 dark:text-gray-300 text-center sm:text-left">
                      {t('recommend.recommendation_number').replace('{number}', (index + 1).toString())}
                    </span>
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center sm:justify-start max-w-sm md:max-w-lg mx-auto sm:mx-0">
                      {numbers.map((number, numIndex) => (
                        <LottoBall 
                          key={numIndex} 
                          number={number} 
                          size="xxl"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      const numbersText = numbers.join(', ');
                      navigator.clipboard.writeText(numbersText);
                      alert(t('recommend.copy_success'));
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                  >
                    {t('common.copy')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={generateRecommendations}
              disabled={loading}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('recommend.button_new')}
            </button>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-3">{t('recommend.warnings_title')}</h3>
        <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 text-sm">
          <li>{t('recommend.warning_reference')}</li>
          <li>{t('recommend.warning_probability')}</li>
          <li>{t('recommend.warning_moderation')}</li>
          <li>{t('recommend.warning_equal')}</li>
        </ul>
      </div>
    </div>
  );
}