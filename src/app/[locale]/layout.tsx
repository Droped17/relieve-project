import { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { Kanit } from 'next/font/google';
import { routing } from '@/src/app/i18n/routing';
import SessionProvider from '@/src/providers/SessionProvider';
import ApolloProviders from '@/src/providers/ApolloProvider';
import { StoreProvider } from '@/src/providers/StoreProvider';
import Header from '@/src/components/organisms/Header';
import '@/src/app/style/globals.css'

const kanit = Kanit({
  subsets: ['thai', 'latin'], // include 'thai' for Kanit
  weight: ['400', '500', '700'], // adjust weights as needed
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'Relieve',
  description: 'HomePage',
};

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
            {/* Redux */}
            <StoreProvider>
              <SessionProvider>
                {/* Header Component */}
                <Header />
                <main>
                  {children}
                </main>
              </SessionProvider>
            </StoreProvider>
            {/* Next Auth */}
          </NextIntlClientProvider>
        </ApolloProviders>
      </body>
    </html>
  );
}