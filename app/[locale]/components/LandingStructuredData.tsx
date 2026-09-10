import { Dictionary, Locale } from '@/lib/i18n'
import { absoluteUrl, siteUrl } from '@/lib/site-url'

export function LandingStructuredData({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RocNest',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Inventory Management',
    operatingSystem: 'Web',
    description: dict.metadata.description,
    url: absoluteUrl(`/${locale}`),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: locale === 'es' ? 'Gratis para siempre' : 'Free forever',
    },
    featureList: dict.pricing.features,
    inLanguage: locale,
    availableLanguage: [
      { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    screenshot: absoluteUrl('/logo.png'),
    softwareVersion: '1.0',
    author: {
      '@type': 'Organization',
      name: 'RocStatus',
      url: 'https://rocstatus.com',
    },
  }

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RocNest',
    url: siteUrl,
    logo: absoluteUrl('/logo.png'),
    description: dict.metadata.description,
    parentOrganization: {
      '@type': 'Organization',
      name: 'RocStatus',
      url: 'https://rocstatus.com',
    },
    sameAs: ['https://rocstatus.com'],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RocNest',
    url: siteUrl,
    description: dict.metadata.description,
    inLanguage: [locale === 'es' ? 'es-ES' : 'en-US'],
    publisher: {
      '@type': 'Organization',
      name: 'RocStatus',
      url: 'https://rocstatus.com',
    },
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dict.faq.items.map((item: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'RocNest',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'es' ? 'Inicio' : 'Home',
        item: absoluteUrl(`/${locale}`),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  )
}
