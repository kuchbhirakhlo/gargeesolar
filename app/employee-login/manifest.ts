import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gargee Solar Solar Employee App',
    short_name: 'Gargee Solar Employee',
    description: 'Solar installation and management app for employees',
    start_url: '/employee-login',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/gargeelogonobg.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/gargeelogonobg.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
}