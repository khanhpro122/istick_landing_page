/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    domains: ['example.com', 'figio.com', 'img.freepik.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  publicRuntimeConfig: {
    API_KEY_MAP: process.env.API_KEY_MAP,
    API_KEY_GG_ANALYTIS: 'id=G-K3X13WVSTR'
  },
  output: 'standalone',
};

module.exports = nextConfig;
