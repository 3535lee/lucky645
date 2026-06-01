import { NextResponse, NextRequest } from 'next/server';

// Map visitor's country (from Vercel edge geo) to default language.
// KR → 한국어, ID/MY → Bahasa Indonesia (close enough to Bahasa Malaysia), everywhere else → English.
function countryToLanguage(country: string): 'ko' | 'en' | 'id' {
  if (country === 'KR') return 'ko';
  if (country === 'ID' || country === 'MY') return 'id';
  return 'en';
}

export function middleware(request: NextRequest) {
  // Only set the cookie once per visitor — if they already have a language,
  // either auto-detected here or manually picked client-side, leave it alone.
  if (request.cookies.get('language')) {
    return NextResponse.next();
  }

  const country = request.headers.get('x-vercel-ip-country') || '';
  const lang = countryToLanguage(country);

  const response = NextResponse.next();
  response.cookies.set('language', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  // Skip API routes, static assets, and image optimizer — only run on page navigations
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp|gif|css|js|woff2?)).*)'],
};
