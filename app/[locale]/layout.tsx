import { Metadata } from 'next'

import { getDictionary, isValidLocale, defaultLocale, locales, Locale } from '@/lib/i18n'

import { PublicFooter } from './components/PublicFooter'
import { PublicNavbar } from './components/PublicNavbar'

type LayoutParams = { locale: string }

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LayoutParams>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale
  const dict = await getDictionary(locale)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rocnest.com'

  const alternateLanguages: Record<string, string> = {}
  for (const l of locales) {
    alternateLanguages[l] = `${baseUrl}/${l}`
  }

  return {
    title: {
      default: dict.metadata.title,
      template: `%s | RocNest`,
    },
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    authors: [{ name: 'RocNest' }, { name: 'RocStatus', url: 'https://rocstatus.com' }],
    creator: 'RocStatus.com',
    publisher: 'RocStatus.com',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: `${baseUrl}/${locale}`,
      siteName: 'RocNest',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: 'RocNest - Sports Equipment Management',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.title,
      description: dict.metadata.description,
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
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<LayoutParams>
}) {
  const { locale: rawLocale } = await params
  const locale = (isValidLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const dict = await getDictionary(locale)

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <PublicFooter locale={locale} dict={dict} />
    </div>
  )
}
