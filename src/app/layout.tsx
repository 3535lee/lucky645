import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Lucky645 - 로또 6/45 당첨번호 조회 및 추천',
  description: '로또 6/45 당첨번호 조회, 번호 검증, 추천 서비스. 1회부터 최신회까지 모든 당첨번호를 확인하세요.',
  keywords: '로또, 6/45, 당첨번호, 로또추천, 로또조회',
  openGraph: {
    title: 'Lucky645 - 로또 6/45 서비스',
    description: '로또 6/45 당첨번호 조회 및 추천 서비스',
    url: 'https://lucky645.xyz',
    siteName: 'Lucky645',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-white dark:bg-gray-900 min-h-screen`}>
        <LanguageProvider>
          <Navigation />
          <main className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
