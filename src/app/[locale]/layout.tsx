import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/src/app/i18n/routing';
import SessionProvider from '@/src/providers/SessionProvider';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        {/* Localization */}
        <NextIntlClientProvider>
        {/* Next Auth */}
          <SessionProvider>
            {children}
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}