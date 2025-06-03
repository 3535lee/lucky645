'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Lucky645
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}>
              {t('navigation.home')}
            </Link>
            <Link href="/lookup" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/lookup')}`}>
              {t('navigation.lookup')}
            </Link>
            <Link href="/verify" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/verify')}`}>
              {t('navigation.verify')}
            </Link>
            <Link href="/recommend" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/recommend')}`}>
              {t('navigation.recommend')}
            </Link>
            <Link href="/contact" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/contact')}`}>
              {t('navigation.contact')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/" 
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
            >
              {t('navigation.home')}
            </Link>
            <Link 
              href="/lookup" 
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/lookup')}`}
            >
              {t('navigation.lookup')}
            </Link>
            <Link 
              href="/verify" 
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/verify')}`}
            >
              {t('navigation.verify')}
            </Link>
            <Link 
              href="/recommend" 
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/recommend')}`}
            >
              {t('navigation.recommend')}
            </Link>
            <Link 
              href="/contact" 
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact')}`}
            >
              {t('navigation.contact')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}