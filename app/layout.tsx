import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { GoogleTagManagerHead, GoogleTagManagerBody } from "@/components/analytics/GoogleTagManager";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RocNest - Software Open Source y Gratuito de Gestión de Material Deportivo",
    template: "%s | RocNest",
  },
  description: "Software open source y 100% gratuito para gestionar material deportivo. Inventario, reservas y préstamos para clubes de montaña, escalada, running, ciclismo y más. Código abierto en GitHub.",
  keywords: "gestión material deportivo, inventario club deportivo, reservas material montaña, software club deportivo gratis, open source sports software, sports equipment management, club inventory, código abierto gestión club",
  authors: [{ name: 'RocNest' }, { name: 'RocStatus', url: 'https://rocstatus.com' }],
  creator: 'RocStatus.com',
  publisher: 'RocStatus.com',
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: 'RocNest - Software Open Source de Gestión de Material Deportivo',
    description: 'Gestiona inventario, reservas y préstamos de material deportivo para tu club. Open source y 100% gratis.',
    url: siteUrl,
    siteName: 'RocNest',
    locale: 'es_ES',
    alternateLocale: ['en_US'],
    type: 'website',
    images: [{
      url: absoluteUrl('/logo.png'),
      width: 1200,
      height: 630,
      alt: 'RocNest - Gestión de Material Deportivo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RocNest - Gestión de Material Deportivo | Open Source y Gratis',
    description: 'Software open source y gratuito para gestionar el material de tu club deportivo. Código abierto en GitHub.',
    images: [absoluteUrl('/logo.png')],
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
      {/*
        No canonical or hreflang links here: each route segment declares its own
        through `alternates` in its metadata. Emitting them again at the root
        produced two contradictory <link rel="canonical"> per page, which Google
        resolves by ignoring both.
      */}
      <head>
        <GoogleTagManagerHead gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
      </head>
      <body className={`${lexend.variable} antialiased`}>
        <GoogleTagManagerBody gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
