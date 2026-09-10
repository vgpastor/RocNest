import { Metadata } from 'next'

import { absoluteUrl } from '@/lib/site-url'

export const metadata: Metadata = {
  title: { absolute: 'Crear cuenta gratis - RocNest | Gestión de Material Deportivo' },
  description:
    'Crea tu cuenta gratuita en RocNest y empieza a gestionar el inventario, las reservas y los préstamos de material de tu club deportivo en menos de dos minutos.',
  alternates: { canonical: absoluteUrl('/register') },
  openGraph: {
    title: 'Crear cuenta gratis en RocNest',
    description:
      'Gestión de material deportivo para clubes: inventario, reservas y préstamos. Open source y gratis para siempre.',
    url: absoluteUrl('/register'),
    siteName: 'RocNest',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: absoluteUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'RocNest - Gestión de Material Deportivo',
      },
    ],
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
