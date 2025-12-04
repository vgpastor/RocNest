export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RocNest',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Gestión de Inventario',
    operatingSystem: 'Web',
    description: 'Software de gestión de material deportivo para clubes, federaciones y equipos. Control de inventario, reservas y préstamos.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: 'Gratis para siempre',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    featureList: [
      'Control de inventario de material deportivo',
      'Sistema de reservas y préstamos',
      'Gestión multi-organización',
      'Sistema de revisiones de material',
      'Gestión de categorías y checklists',
    ],
    inLanguage: 'es',
    availableLanguage: {
      '@type': 'Language',
      name: 'Spanish',
      alternateName: 'es',
    },
  }

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RocNest',
    description: 'Plataforma de gestión de material deportivo para clubes',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    logo: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png',
  }

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Es realmente gratis?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, RocNest es completamente gratuito. No hay costes ocultos ni periodos de prueba limitados.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto tarda en configurarse?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Puedes crear tu cuenta y organización en menos de 2 minutos. El sistema está listo para usar inmediatamente.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Para qué tipo de clubes es RocNest?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'RocNest está diseñado para clubes de montaña, escalada, running, alpinismo, federaciones deportivas y cualquier organización que necesite gestionar material deportivo compartido.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  )
}
