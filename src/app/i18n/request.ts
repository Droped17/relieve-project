import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;


  // Load all namespaces dynamically
  const messages = {
    en: async () => {
      const files = await Promise.all([
        import('@/src/app/messages/en/common.json'),
        import('@/src/app/messages/en/page.json'),
      ]);
      return Object.assign({}, ...files.map(file => file.default));
    },
    th: async () => {
      const files = await Promise.all([
        import('@/src/app/messages/th/common.json'),
        import('@/src/app/messages/th/page.json'),
      ]);
      return Object.assign({}, ...files.map(file => file.default));
    },
  };
  

  // Merge namespaces into one object
  const mergedMessages = await messages[locale]()

  return {
    locale,
    messages: mergedMessages,
  };
});
