const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  publicRuntimeConfig: {
    KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
    KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY,
  },
  env: {
    TZ: "Asia/Seoul", // 원하는 타임존으로 변경하세요
  },
};

module.exports = nextConfig;
