'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LottoBall from '@/components/LottoBall';
import { formatDate, formatPrize } from '@/lib/utils';

interface LottoResult {
  round: number;
  date: string;
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num5: number;
  num6: number;
  bonus: number;
  first_prize: number;
  first_winners: number;
  second_prize: number;
  second_winners: number;
  third_prize: number;
  third_winners: number;
}

interface HomeContentProps {
  latestResult: LottoResult | null;
  databaseError: boolean;
}

export default function HomeContent({ latestResult, databaseError }: HomeContentProps) {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-12 pb-20">
      <section className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          {t('home.subtitle')}
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/lookup" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('home.lookup_title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('home.lookup_desc')}</p>
          </div>
        </Link>

        <Link href="/verify" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('home.verify_title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('home.verify_desc')}</p>
          </div>
        </Link>

        <Link href="/recommend" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('home.recommend_title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('home.recommend_desc')}</p>
          </div>
        </Link>

        <Link href="/contact" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('home.contact_title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('home.contact_desc')}</p>
          </div>
        </Link>
      </section>

      {databaseError ? (
        <section className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 shadow-md">
          <div className="text-center">
            <p className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              {t('home.database_setup_needed')}
            </p>
            <p className="text-yellow-700 dark:text-yellow-300">
              {t('home.database_setup_instruction')}
            </p>
          </div>
        </section>
      ) : latestResult ? (
        <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('home.latest_result').replace('{round}', latestResult.round.toString())}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{formatDate(latestResult.date, language)}</p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('home.winning_numbers')}</span>
              <div className="flex gap-3">
                <LottoBall number={latestResult.num1} size="lg" />
                <LottoBall number={latestResult.num2} size="lg" />
                <LottoBall number={latestResult.num3} size="lg" />
                <LottoBall number={latestResult.num4} size="lg" />
                <LottoBall number={latestResult.num5} size="lg" />
                <LottoBall number={latestResult.num6} size="lg" />
              </div>
              <span className="text-lg text-gray-500 dark:text-gray-400 mx-2">+</span>
              <div className="flex flex-col items-center">
                <LottoBall number={latestResult.bonus} size="lg" isBonus />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('home.bonus')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border-l-4 border-yellow-400">
              <div className="text-center">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">{t('home.first_prize')}</h3>
                <p className="text-2xl font-bold text-yellow-600 mb-1">{formatPrize(latestResult.first_prize, language)}</p>
                <p className="text-yellow-700">{latestResult.first_winners}{t('home.winners_suffix')}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-400">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">{t('home.second_prize')}</h3>
                <p className="text-2xl font-bold text-green-600 mb-1">{formatPrize(latestResult.second_prize, language)}</p>
                <p className="text-green-700">{latestResult.second_winners}{t('home.winners_suffix')}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-400">
              <div className="text-center">
                <h3 className="text-lg font-bold text-purple-800 mb-2">{t('home.third_prize')}</h3>
                <p className="text-2xl font-bold text-purple-600 mb-1">{formatPrize(latestResult.third_prize, language)}</p>
                <p className="text-purple-700">{latestResult.third_winners}{t('home.winners_suffix')}</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.data_loading')}</p>
          </div>
        </section>
      )}

      {/* Footer with database info */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 dark:bg-gray-950 text-gray-100 dark:text-gray-200 py-3">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center text-sm">
            {latestResult ? (
              <>
                {t('home.footer_latest').replace('{round}', latestResult.round.toString())} | {t('home.footer_database').replace('{round}', latestResult.round.toString())}
              </>
            ) : (
              <>{t('home.footer_service')}</>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}