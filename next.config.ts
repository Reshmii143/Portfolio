import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray package-lock.json in the home folder confuses root detection; pin it to this project.
  turbopack: { root: path.resolve(import.meta.dirname) },
}

export default nextConfig
