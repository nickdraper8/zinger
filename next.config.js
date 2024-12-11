/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'i.imgur.com',
      },
      {
        hostname: 'c8.alamy.com'
      },
      {
        hostname: 'scontent-lga3-1.xx.fbcdn.net'
      }
    ],
  },
}

module.exports = nextConfig
