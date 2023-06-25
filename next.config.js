/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  publicRuntimeConfig: {
    KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
    KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY,
  }
};

module.exports = nextConfig;
