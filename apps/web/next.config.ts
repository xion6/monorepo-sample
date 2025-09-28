import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
