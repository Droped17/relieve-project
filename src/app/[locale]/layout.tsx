import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/src/app/i18n/routing';
import SessionProvider from '@/src/providers/SessionProvider';
import ApolloProviders from '@/src/providers/ApolloProvider';
import '@/src/app/style/globals.css'
import Header from '@/src/components/organisms/Header';
import { Kanit } from 'next/font/google';

const kanit = Kanit({
  subsets: ['thai', 'latin'], // include 'thai' for Kanit
  weight: ['400', '500', '700'], // adjust weights as needed
  display: 'swap',
});

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
  const messages = (await import(`@/src/app/messages/${locale}/page.json`)).default;

  return (
    <html lang={locale} className={kanit.className}>
      <body className='text-tertiary'>
        {/* Apollo */}
        <ApolloProviders>
          {/* Localization */}
          <NextIntlClientProvider messages={messages}>
            {/* Next Auth */}
            <SessionProvider>
              {/* Header Component */}
              <Header />
                <main>
                  {children}
                </main>
            </SessionProvider>
          </NextIntlClientProvider>
        </ApolloProviders>
      </body>
    </html>
  );
}