/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.46'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dtdkjtqwnwqvozkayeps.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        pathname: '/product-images/**',
      },
    ],
  },
};

module.exports = nextConfig;