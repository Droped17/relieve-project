// MARK: - Hard Code version

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
        import('@/src/app/messages/en/homepage.json'),
      ]);
      return Object.assign({}, ...files.map(file => file.default));
    },
    th: async () => {
      const files = await Promise.all([
        import('@/src/app/messages/th/common.json'),
        import('@/src/app/messages/th/homepage.json'),
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


/* ==================================================================== */

// MARK: - Dynamic version (error: Edge Runtime)

// import { getRequestConfig } from 'next-intl/server';
// import { hasLocale } from 'next-intl';
// import { routing } from './routing';
// import fs from 'fs';
// import path from 'path';

// export default getRequestConfig(async ({ requestLocale }) => {
//   const requested = await requestLocale;
//   const locale = hasLocale(routing.locales, requested)
//     ? requested
//     : routing.defaultLocale;

//   const messagesDir = path.resolve(process.cwd(), 'src/app/messages', locale);

//   const messages: Record<string, unknown> = {};

//   try {
//     const files = fs.readdirSync(messagesDir);

//     for (const file of files) {
//       if (file.endsWith('.json')) {
//         const namespace = path.basename(file, '.json'); // Get "common" from "common.json"
//         const filePath = path.join(messagesDir, file);
//         const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//         messages[namespace] = content;
//       }
//     }
//   } catch (error) {
//     console.error(`Error reading translation files for locale '${locale}':`, error);
//   }

//   return {
//     locale,
//     messages
//   };
// });
