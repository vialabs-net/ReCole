/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'lintac.cl',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      allowedOrigins: [
        'redesigned-rotary-phone-xg5v46v6ghv55w-3000.app.github.dev',
        'localhost:3000',
      ],
    },
  },
}

module.exports = nextConfig
