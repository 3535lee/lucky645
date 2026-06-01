'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ko' | 'en' | 'id';

interface ExchangeRate {
  unit: number;
  krw_per_unit: number;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  rates: Record<string, ExchangeRate>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('ko');
  const [translations, setTranslations] = useState<Record<string, unknown>>({});
  const [rates, setRates] = useState<Record<string, ExchangeRate>>({});

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['ko', 'en', 'id'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Load exchange rates
    fetch('/api/rates')
      .then(r => r.json())
      .then(data => {
        if (data?.rates) setRates(data.rates);
      })
      .catch(err => console.error('[Rates] Failed to load:', err));
  }, []);

  useEffect(() => {
    // Load translations for current language
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../translations/${language}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fallback to Korean if loading fails
        if (language !== 'ko') {
          const fallback = await import('../translations/ko.json');
          setTranslations(fallback.default);
        }
      }
    };

    loadTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, rates }}>
      {children}
    </LanguageContext.Provider>
  );
}