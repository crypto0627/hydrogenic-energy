import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: "public", 
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // 開發環境關閉 PWA
});

const nextConfig = withPWA({
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
});

export default nextConfig;
