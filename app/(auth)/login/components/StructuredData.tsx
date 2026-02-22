export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rocnest.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RocNest',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Inventory Management',
    operatingSystem: 'Web',
    url: baseUrl,
    description: 'Software open source y gratuito de gestión de material deportivo para clubes, federaciones y equipos. Código abierto en GitHub, abierto a contribuciones de la comunidad. Control de inventario, reservas y préstamos.',
    license: 'https://opensource.org/licenses',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: 'Gratis para siempre - Software Open Source',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '47',
      bestRating: '5',
    },
    featureList: [
      'Software open source - código abierto en GitHub',
      'Abierto a contribuciones de la comunidad',
      'Control de inventario de material deportivo',
      'Sistema de reservas y préstamos',
      'Gestión multi-organización',
      'Sistema de revisiones de material',
      'Gestión de categorías y checklists',
      'Roles y permisos granulares',
      'Seguridad y cifrado de datos',
    ],
    inLanguage: ['es', 'en'],
    availableLanguage: [
      { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    downloadUrl: 'https://github.com/vgpastor/RocNest',
    installUrl: 'https://github.com/vgpastor/RocNest',
    softwareHelp: {
      '@type': 'CreativeWork',
      url: 'https://github.com/vgpastor/RocNest#readme',
    },
    author: {
      '@type': 'Organization',
      name: 'RocStatus',
      url: 'https://rocstatus.com',
    },
  }

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RocNest',
    description: 'Plataforma open source y gratuita de gestión de material deportivo para clubes y organizaciones',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    parentOrganization: {
      '@type': 'Organization',
      name: 'RocStatus',
      url: 'https://rocstatus.com',
    },
    sameAs: ['https://rocstatus.com', 'https://github.com/vgpastor/RocNest'],
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
          text: 'Sí, RocNest es 100% gratuito porque es software open source. El código fuente está disponible públicamente en GitHub y cualquiera puede usarlo, modificarlo y contribuir. Es un proyecto de RocStatus.com creado con pasión por el deporte y la tecnología.',
        },
      },
      {
        '@type': 'Question',
        name: '¿RocNest es open source?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, RocNest es software de código abierto. El repositorio está disponible públicamente en GitHub (github.com/vgpastor/RocNest). Cualquier persona puede ver el código, reportar problemas, proponer mejoras y contribuir al desarrollo. Esto garantiza transparencia total y que el software mejore continuamente gracias a la comunidad.',
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
          text: 'RocNest está diseñado para clubes de montaña, escalada, running, ciclismo, esquí, buceo, kayak, federaciones deportivas y cualquier organización que necesite gestionar material deportivo compartido.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Puedo gestionar varios clubes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, RocNest es multi-organización. Puedes gestionar tantos clubes o secciones como necesites desde una sola cuenta.',
        },
      },
    ],
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RocNest',
    url: baseUrl,
    description: 'Software open source y gratuito de gestión de material deportivo para clubes',
    inLanguage: ['es-ES', 'en-US'],
    publisher: {
      '@type': 'Organization',
      name: 'RocStatus',
      url: 'https://rocstatus.com',
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  )
}
