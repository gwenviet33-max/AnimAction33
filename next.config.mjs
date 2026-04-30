import os from 'os'
import path from 'path'

// On macOS Desktop (iCloud-synced), Next.js's build output collides with iCloud Drive sync,
// causing race conditions and missing-file errors. We redirect distDir to /tmp ONLY for
// local builds — on Netlify (and any CI), we keep the default `.next` so the deploy plugin
// can find the build output.
const isCI = !!(process.env.NETLIFY || process.env.CI || process.env.VERCEL)
const distDir = isCI ? '.next' : path.join(os.tmpdir(), 'animaction33-build', '.next')

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir,
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
