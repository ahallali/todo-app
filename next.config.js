/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The public demo has no account service. Never serve credential forms.
  async redirects() {
    return ['/login', '/signup'].map(source => ({ source, destination: '/todos', permanent: false }));
  },
};
module.exports = nextConfig;
