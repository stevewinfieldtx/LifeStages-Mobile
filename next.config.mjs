/** @type {import('next').NextConfig} */
const isMobile = process.env.BUILD_TARGET === 'mobile'

const nextConfig = {
  // Static export for Capacitor mobile builds
  // Web builds continue to use server-side rendering
  ...(isMobile && {
    output: 'export',
  }),
  
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  compress: true,
  
  // Only apply headers for web builds (static export doesn't support them)
  ...(!isMobile && {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains; preload',
            },
          ],
        },
        {
          source: '/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ]
    },
  }),
}

export default nextConfig
