import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    images: {
        domains: ['images.unsplash.com']
    }
};
 
const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');
export default withNextIntl(nextConfig);