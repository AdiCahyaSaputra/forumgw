/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_SOCKET_URL: process.env.BASE_SOCKET_URL,
    SERVER_SOCKET_URL: process.env.SERVER_SOCKET_URL,
  },
  i18n: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
    localeDetection: false
  }
};

module.exports = nextConfig;
