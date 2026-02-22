import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rocnest.com'

export const metadata: Metadata = {
  title: {
    default: "RocNest - Software Gratuito de Gestión de Material Deportivo para Clubes",
    template: "%s | RocNest",
  },
  description: "El software gratuito n.º 1 para gestionar material deportivo. Inventario, reservas y préstamos para clubes de montaña, escalada, running, ciclismo y más.",
  keywords: "gestión material deportivo, inventario club deportivo, reservas material montaña, software club deportivo gratis, sports equipment management, club inventory, free sports software",
  authors: [{ name: 'RocNest' }, { name: 'RocStatus', url: 'https://rocstatus.com' }],
  creator: 'RocStatus.com',
  publisher: 'RocStatus.com',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'RocNest - Software Gratuito de Gestión de Material Deportivo',
    description: 'Gestiona inventario, reservas y préstamos de material deportivo para tu club. 100% gratis.',
    url: baseUrl,
    siteName: 'RocNest',
    locale: 'es_ES',
    alternateLocale: ['en_US'],
    type: 'website',
    images: [{
      url: `${baseUrl}/logo.png`,
      width: 1200,
      height: 630,
      alt: 'RocNest - Gestión de Material Deportivo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RocNest - Gestión de Material Deportivo Gratis',
    description: 'Software gratuito para gestionar el material de tu club deportivo.',
    images: [`${baseUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={baseUrl} />
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/es`} />
      </head>
      <body className={`${lexend.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
