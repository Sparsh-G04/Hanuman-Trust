/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow large file uploads (videos up to 100MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

module.exports = nextConfig;
