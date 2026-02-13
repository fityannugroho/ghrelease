import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // GitHub avatars
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production'
    const connectSrc = [
      "'self'",
      'https://api.github.com',
      'https://avatars.githubusercontent.com',
    ]
    if (isDev) {
      connectSrc.push('ws:', 'http://localhost:*')
    }

    // Build script-src directive with Umami domain if configured
    const scriptSrc = ["'self'", "'unsafe-inline'"]
    if (process.env.UMAMI_SCRIPT_URL) {
      try {
        const umamiUrl = new URL(process.env.UMAMI_SCRIPT_URL)
        scriptSrc.push(`${umamiUrl.protocol}//${umamiUrl.host}`)
      } catch {
        // Invalid URL, skip adding to CSP
      }
    }

    const headerValues = [
      "default-src 'self'",
      `script-src ${scriptSrc.join(' ')}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://avatars.githubusercontent.com",
      `connect-src ${connectSrc.join(' ')}`,
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ]

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: headerValues.join('; '),
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

export default nextConfig
