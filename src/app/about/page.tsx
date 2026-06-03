'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const PRIZE_TIERS = [
  { color: 'from-yellow-400 to-amber-500' },
  { color: 'from-gray-300 to-gray-400' },
  { color: 'from-amber-600 to-amber-700' },
];

function LottoBallIllustration({ numbers, size = 'lg' }: { numbers: number[]; size?: 'sm' | 'lg' }) {
  const ballSize = size === 'lg' ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm';
  const colors = [
    'bg-yellow-400 text-yellow-900',
    'bg-blue-500 text-white',
    'bg-red-500 text-white',
    'bg-gray-700 text-white',
    'bg-green-500 text-white',
    'bg-purple-500 text-white',
  ];
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {numbers.map((n, i) => (
        <div
          key={i}
          className={`${ballSize} ${colors[i % colors.length]} rounded-full flex items-center justify-center font-bold shadow-lg`}
        >
          {n}
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  const { language, t } = useLanguage();
  const router = useRouter();

  const translationsLoaded = t('navigation.home') !== 'navigation.home';

  useEffect(() => {
    if (translationsLoaded && language === 'ko') {
      router.replace('/');
    }
  }, [language, translationsLoaded, router]);

  if (!translationsLoaded || language === 'ko') return null;

  return (
    <div className="space-y-10 pb-24 max-w-4xl mx-auto">
      {/* Hero */}
      <section className="text-center py-8">
        <div className="mb-6">
          <LottoBallIllustration numbers={[3, 11, 19, 28, 35, 42]} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t('about.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('about.subtitle')}
        </p>
      </section>

      {/* What is Lotto 6/45 */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-10 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl shrink-0">🏛️</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t('about.what_title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('about.what_desc')}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2002</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('about.stat_since')}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{t('about.stat_weekly_value')}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('about.stat_weekly')}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">45</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('about.stat_balls')}</div>
          </div>
        </div>
      </section>

      {/* How to Play */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-10 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl shrink-0">🎯</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('about.how_title')}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{t('about.step1_title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{t('about.step1_desc')}</p>
              <div className="mt-3">
                <LottoBallIllustration numbers={[7, 14, 21, 33, 39, 45]} size="sm" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{t('about.step2_title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{t('about.step2_desc')}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{t('about.step3_title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{t('about.step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Draw Schedule */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 sm:p-10 shadow-md text-white">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl shrink-0">📅</div>
          <div>
            <h2 className="text-2xl font-bold mb-3">{t('about.draw_title')}</h2>
            <p className="text-indigo-100 leading-relaxed">{t('about.draw_desc')}</p>
          </div>
        </div>
        <div className="mt-6 bg-white/15 backdrop-blur rounded-xl p-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-indigo-200 uppercase tracking-wide">{t('about.draw_day')}</div>
              <div className="text-xl font-bold mt-1">{t('about.draw_day_value')}</div>
            </div>
            <div>
              <div className="text-sm text-indigo-200 uppercase tracking-wide">{t('about.draw_time')}</div>
              <div className="text-xl font-bold mt-1">{t('about.draw_time_value')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Tiers */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-10 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl shrink-0">🏆</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('about.prizes_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('about.prizes_desc')}</p>
          </div>
        </div>

        <div className="space-y-3">
          {PRIZE_TIERS.map((tier, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {t(`about.prize_${i + 1}_title`)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t(`about.prize_${i + 1}_desc`)}
                </div>
              </div>
              {i === 0 && (
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {t('about.prize_1_amount')}
                  </div>
                  <div className="text-xs text-gray-500">{t('about.prize_typical')}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About Lucky645 */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 sm:p-10 shadow-md text-white">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl shrink-0">🌏</div>
          <div>
            <h2 className="text-2xl font-bold mb-3">{t('about.lucky645_title')}</h2>
            <p className="text-blue-100 leading-relaxed mb-4">{t('about.lucky645_desc')}</p>
            <ul className="space-y-2 text-blue-50">
              <li className="flex items-center gap-2">
                <span className="text-lg">✅</span> {t('about.lucky645_feature1')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">✅</span> {t('about.lucky645_feature2')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">✅</span> {t('about.lucky645_feature3')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">✅</span> {t('about.lucky645_feature4')}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/recommend"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('about.try_now')}
          </Link>
        </div>
      </section>
    </div>
  );
}
