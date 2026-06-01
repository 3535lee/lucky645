'use client';

import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ConfettiCTA() {
  const { t, language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [fired, setFired] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (language === 'ko') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired) {
            setVisible(true);
            setFired(true);
            launchFireworks();
          }
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fired, language]);

  const launchFireworks = () => {
    const duration = 2500;
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
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA'],
      });
    }, 250);
  };

  const replay = () => {
    setVisible(true);
    launchFireworks();
  };

  if (language === 'ko') return null;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 dark:from-purple-800 dark:via-pink-700 dark:to-orange-700 rounded-2xl shadow-2xl p-8 md:p-12 my-8"
    >
      {/* Sparkle overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-4 left-8 text-4xl animate-pulse">✨</div>
        <div className="absolute top-12 right-12 text-3xl animate-bounce">🎉</div>
        <div className="absolute bottom-8 left-16 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute bottom-12 right-8 text-3xl animate-bounce" style={{ animationDelay: '0.8s' }}>🎊</div>
        <div className="absolute top-1/2 left-1/4 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>💫</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌟</div>
      </div>

      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
          {t('home.cta_headline')}
        </h2>
        <p className="text-4xl md:text-6xl font-black text-yellow-300 drop-shadow-2xl mb-6 animate-pulse">
          {t('home.cta_highlight')}
        </p>
        <p className="text-lg md:text-xl text-white/90 mb-8">
          {t('home.cta_subtext')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/recommend"
            onClick={replay}
            className="inline-block bg-white text-purple-700 font-bold text-lg md:text-xl px-8 py-4 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 hover:bg-yellow-300"
          >
            🎰 {t('home.cta_button')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
