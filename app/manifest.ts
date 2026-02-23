import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'RocNest - Gestión de Material Deportivo',
        short_name: 'RocNest',
        description: 'Software open source y gratuito para gestionar material deportivo. Inventario, reservas y préstamos para clubes.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0f',
        theme_color: '#6366f1',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '48x48',
                type: 'image/x-icon',
            },
            {
                src: '/icon.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    }
}
