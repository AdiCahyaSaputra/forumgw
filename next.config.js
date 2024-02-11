/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_SOCKET_URL: process.env.BASE_SOCKET_URL,
    SERVER_SOCKET_URL: process.env.SERVER_SOCKET_URL,
  },
};

module.exports = nextConfig;
