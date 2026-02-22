import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RocNest - Gestión de Material Deportivo para Clubes | Open Source y Gratis',
  description: 'Software open source y gratuito para gestionar el material de tu club deportivo, federación o equipo. Código abierto en GitHub, abierto a contribuciones. Control de inventario, reservas y préstamos en minutos.',
  keywords: 'gestión material deportivo, inventario club, reservas material, software open source club deportivo, código abierto gestión material, material montaña, préstamo material club, gestión club deportivo gratis',
  authors: [{ name: 'RocNest' }, { name: 'RocStatus', url: 'https://rocstatus.com' }],
  creator: 'RocStatus.com',
  publisher: 'RocStatus.com',
  openGraph: {
    title: 'RocNest - Software Open Source de Gestión de Material para Clubes',
    description: 'Organiza el material de tu club en minutos. Open source, gratuito y abierto a contribuciones.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'RocNest - Gestión de Material Deportivo',
      },
    ],
    type: 'website',
    locale: 'es_ES',
    siteName: 'RocNest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RocNest - Software Open Source de Gestión de Material para Clubes',
    description: 'Organiza el material de tu club en minutos. Open source, gratuito y abierto a contribuciones.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Añadir cuando tengas las verificaciones de Google/Bing
    // google: 'tu-codigo-de-verificacion',
    // bing: 'tu-codigo-de-verificacion',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
