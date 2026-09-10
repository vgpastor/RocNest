import { Metadata } from 'next'

import { absoluteUrl } from '@/lib/site-url'

export const metadata: Metadata = {
  // `absolute` opts out of the root "%s | RocNest" template, which this title
  // already carries its own brand suffix for.
  title: { absolute: 'Iniciar sesión - RocNest | Gestión de Material Deportivo' },
  description: 'Software open source y gratuito para gestionar el material de tu club deportivo, federación o equipo. Código abierto en GitHub, abierto a contribuciones. Control de inventario, reservas y préstamos en minutos.',
  keywords: 'gestión material deportivo, inventario club, reservas material, software open source club deportivo, código abierto gestión material, material montaña, préstamo material club, gestión club deportivo gratis',
  alternates: { canonical: absoluteUrl('/login') },
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
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
