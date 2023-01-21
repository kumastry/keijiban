const { flattenOptionGroups } = require('@mui/base');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about', // リダイレクト元のURL
        destination: '/redirect_page_url', // リダイレクト先のURL
        permanent: false, // 永続的なリダイレクトかのフラグ
      },
    ]
  }
};

module.exports = nextConfig;
