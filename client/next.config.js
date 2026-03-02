const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'api.pika.ai'],
  },
  allowedDevOrigins: ['192.168.1.7'],
}

module.exports = withPWA(nextConfig)