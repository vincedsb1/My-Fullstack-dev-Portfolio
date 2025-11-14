import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Vérifier si locale est déjà dans l'URL
  const pathnameHasLocale = ['/en', '/fr'].some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Déterminer la locale préférée
  const locale = getLocaleFromRequest(request);

  // Rediriger vers la locale appropriée
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );
}

function getLocaleFromRequest(request: NextRequest): string {
  // Vérifier localStorage (via cookie)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && ['en', 'fr'].includes(cookieLocale)) {
    return cookieLocale;
  }

  // Déterminer via Accept-Language
  const acceptLanguage = request.headers.get('accept-language') || '';
  if (acceptLanguage.includes('fr')) return 'fr';

  return 'en'; // Défaut
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico)(?:.*))'],
};
