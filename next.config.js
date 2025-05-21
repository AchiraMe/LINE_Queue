/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    loader: 'akamai',
    domains: ['localhost', 'eco-dev.unique.co.th', 'api.unique.engineering', 'eco-test.unique.co.th'],
    unoptimized: true,
    path: '/',
  },
  env: {
    API_URL1: 'https://api.unique.engineering/apidev/queuebooking.php',
  },
}
module.exports = nextConfig