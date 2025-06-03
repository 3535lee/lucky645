import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { LanguageProvider } from '@/contexts/LanguageContext';
import PWARegister from '@/components/PWARegister';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://lucky645.xyz'),
  title: 'Lucky645 - 로또 6/45 당첨번호 조회 및 추천',
  description: '로또 6/45 당첨번호 조회, 번호 검증, 추천 서비스. 1회부터 최신회까지 모든 당첨번호를 확인하세요.',
  keywords: '로또, 6/45, 당첨번호, 로또추천, 로또조회',
  manifest: '/manifest.json',
  applicationName: 'Lucky645',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lucky645',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon.png',
      },
      {
        rel: 'mask-icon',
        url: '/icon.svg',
        color: '#2563eb',
      },
    ],
  },
  openGraph: {
    title: 'Lucky645 - 로또 6/45 서비스',
    description: '로또 6/45 당첨번호 조회 및 추천 서비스',
    url: 'https://lucky645.xyz',
    siteName: 'Lucky645',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Lucky645 로고',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Lucky645 - 로또 6/45 서비스',
    description: '로또 6/45 당첨번호 조회 및 추천 서비스',
    images: ['/icon-512x512.png'],
  },
  robots: 'index, follow',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Lucky645',
    'msapplication-TileColor': '#2563eb',
    'msapplication-TileImage': '/icon-192x192.png',
    'msapplication-square70x70logo': '/icon-192x192.png',
    'msapplication-square150x150logo': '/icon-192x192.png',
    'msapplication-wide310x150logo': '/icon-512x512.png',
    'msapplication-square310x310logo': '/icon-512x512.png',
  },
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
          <PWARegister />
        </LanguageProvider>
      </body>
    </html>
  );
}
