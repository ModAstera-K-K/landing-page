/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/i,
      type: "asset/resource",
    });
    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
