/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  devIndicators: {
    buildActivity: false,
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",
  webpack(config) {
    config.optimization.minimize = false; // Temporarily disable CSS minification
    return config;
  },
};

export default nextConfig;
