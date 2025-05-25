import createMiddleware from 'next-intl/middleware';
import { routing } from '@/src/app/i18n/routing'
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const initMiddleware = createMiddleware(routing);

/* MARK: Protect Routes */
const protectedRoutes = [
  '/admin',
  '/dashboard',
]

const isProtectedRoute = (pathname: string) => {
  // Extract path without locale prefix if it exists
  const segments = pathname.split('/');
  let pathToCheck = pathname;

  // If first segment is a valid locale, remove it for the check
  if (segments.length > 1 && routing.locales.includes(segments[1])) {
    pathToCheck = '/' + segments.slice(2).join('/');
  }

  console.log(`Checking path: ${pathname}, normalized to: ${pathToCheck}`);

  return protectedRoutes.some(route =>
    pathToCheck === route || pathToCheck.startsWith(`${route}/`)
  );
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`Middleware running for: ${pathname}`);

  if (isProtectedRoute(pathname)) {
    console.log(`Protected route detected: ${pathname}`);

    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });

      console.log(`Token result: ${token ? 'Token exists' : 'No token found'}`);

      if (!token) {
        console.log('No auth token - redirecting to login');
        const locale = pathname.split('/')[1];
        const isValidLocale = routing.locales.includes(locale);

        const callbackUrl = request.nextUrl.clone();

        const redirectPath = isValidLocale
          ? `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl.toString())}`
          : `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl.toString())}`;

        console.log(`Redirecting to: ${redirectPath}`);
        const url = new URL(redirectPath, request.url);
        return NextResponse.redirect(url);
      }

      /* If not ADMIN */
      if (pathname.includes('/admin')) {
        console.log(`Admin route check: User role is ${token.role}`);

        if (token.role !== "ADMIN") {
          console.log('Not admin - redirecting to unauthorized');
          const locale = pathname.split('/')[1];
          const isValidLocale = routing.locales.includes(locale);

          const unauthorizedPath = isValidLocale
            ? `/${locale}/not-found`
            : `/not-found`;

          console.log(`Redirecting to: ${unauthorizedPath}`);
          const url = new URL(unauthorizedPath, request.url);
          return NextResponse.redirect(url);
        }
      }
    } catch (error) {
      console.error('Error in auth middleware:', error);
      // Continue to avoid breaking the site on auth errors
    }
  }

  return initMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};