import { Metadata } from 'next'

import { CookieConsent } from '@/components/consent/CookieConsent'
import { getDictionary, isValidLocale, defaultLocale, locales, Locale } from '@/lib/i18n'
import { absoluteUrl } from '@/lib/site-url'

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

  const alternateLanguages: Record<string, string> = {}
  for (const l of locales) {
    alternateLanguages[l] = absoluteUrl(`/${l}`)
  }
  alternateLanguages['x-default'] = absoluteUrl(`/${defaultLocale}`)

  return {
    title: {
      absolute: dict.metadata.title,
      template: `%s | RocNest`,
    },
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: alternateLanguages,
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: absoluteUrl(`/${locale}`),
      siteName: 'RocNest',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: absoluteUrl('/logo.png'),
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
      images: [absoluteUrl('/logo.png')],
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
    <div lang={locale} className="min-h-screen flex flex-col">
      <PublicNavbar locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <PublicFooter locale={locale} dict={dict} />
      <CookieConsent copy={dict.consent} locale={locale} />
    </div>
  )
}
