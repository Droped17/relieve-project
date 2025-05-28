// import {NextConfig} from 'next';
// // import createNextIntlPlugin from 'next-intl/plugin';
//  import { fileURLToPath } from 'url';
// import { createRequire } from 'module';

// const require = createRequire(import.meta.url);
// const __filename = fileURLToPath(import.meta.url);
// require('path').dirname(__filename);

// // @ts-check

// /**
//  * @type {import('next').NextConfig}
//  */


// const nextConfig: NextConfig = {
//     images: {
//         domains: ['images.unsplash.com', 'plus.unsplash.com', 'res.cloudinary.com']
//     },
//     reactStrictMode: true,
//     swcMinify: true,
// };
 
// // const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });
// /* INTL */
// // export default withNextIntl(nextConfig);
// /* ANALYZER */
// export default withBundleAnalyzer(nextConfig);


import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        domains: ['images.unsplash.com', 'plus.unsplash.com', 'res.cloudinary.com']
    },
};
 
const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');

/* INTL */
export default withNextIntl(nextConfig);