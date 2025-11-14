import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  // This is the default (also the `src` folder is supported).
  './i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },
  compress: true,
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
