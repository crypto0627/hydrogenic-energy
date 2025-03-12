import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig = withPWA({
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
});

export default nextConfig;
