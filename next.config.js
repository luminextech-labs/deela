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
    ],
  },
};

module.exports = nextConfig;