import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },  // Google avatars
      { protocol: 'https', hostname: '*.fbcdn.net' },               // Facebook avatars
      { protocol: 'https', hostname: 'zdkgtmufkhpqwabfjhcg.supabase.co', pathname: '/storage/v1/object/public/**' }, // Event images
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },  // Google profile pictures
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }, // Unsplash images
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },   // Pexels images
    ],

  },
}

export default nextConfig