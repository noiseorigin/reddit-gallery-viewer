/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['www.reddit.com', 'reddit.com', 'i.redd.it', 'i.imgur.com', 'preview.redd.it'],
  },
};

module.exports = nextConfig;
