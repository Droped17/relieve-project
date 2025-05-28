import createMiddleware from 'next-intl/middleware';
import { routing } from '@/src/app/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define the type for your locales based on the `routing.locales` array.
// This ensures type safety when working with locales.
type Locales = (typeof routing.locales)[number]; // Extracts 'en' | 'th' from the array

const initMiddleware = createMiddleware({
  // Use `routing.locales` directly. TypeScript will infer the union type.
  locales: routing.locales,
  defaultLocale: routing.defaultLocale, // Assuming defaultLocale is also in routing
  // You can also add other options from next-intl's middleware, e.g.:
  // localePrefix: 'always', // or 'never', 'as-needed'
});

/* MARK: Protect Routes */
const protectedRoutes = [
  '/admin',
  '/dashboard',
];

const isProtectedRoute = (pathname: string) => {
  const segments = pathname.split('/');
  let pathToCheck = pathname;

  // If first segment is a valid locale, remove it for the check
  // Ensure the type of `segments[1]` is compatible with `routing.locales` check
  if (segments.length > 1 && routing.locales.includes(segments[1] as Locales)) {
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
        // Cast `locale` to `Locales` after checking if it's a valid locale
        const isValidLocale = routing.locales.includes(locale as Locales);

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
        // You might need to extend the NextAuth.js `token` type to include 'role'.
        // Refer to the previous answer about extending NextAuth types.
        console.log(`Admin route check: User role is ${token.role}`); // Assuming token.role is available

        if (token.role !== "ADMIN") { // Assuming "ADMIN" is a string literal role
          console.log('Not admin - redirecting to unauthorized');
          const locale = pathname.split('/')[1];
          const isValidLocale = routing.locales.includes(locale as Locales);

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
      // It's often better to redirect to a generic error page or signin page
      // rather than continuing to a potentially sensitive page if auth fails.
      // For production, consider more robust error handling.
      const url = new URL('/auth/signin', request.url); // Example: redirect to signin on unexpected error
      return NextResponse.redirect(url);
    }
  }

  // Pass the request to the next-intl middleware for locale handling
  return initMiddleware(request);
}

export const config = {
  // Matches all requests except for static files, API routes, and _next/data routes
  matcher: '/((?!api|trpc|_next/static|_next/image|favicon.ico).*)'
};