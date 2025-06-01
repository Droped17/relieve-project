import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
    async redirects() {
        return [
            {
                source: '/th',
                destination: '/th/homepage',
                permanent: true
            }
        ]
    },
};
 
const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');

/* INTL */
export default withNextIntl(nextConfig);