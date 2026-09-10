import { absoluteUrl, siteUrl } from '@/lib/site-url'

export function StructuredData() {

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RocNest',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Inventory Management',
    operatingSystem: 'Web',
    url: siteUrl,
    description: 'Software open source y gratuito de gestión de material deportivo para clubes, federaciones y equipos. Código abierto en GitHub, abierto a contribuciones de la comunidad. Control de inventario, reservas y préstamos.',
    license: 'https://www.gnu.org/licenses/agpl-3.0.html',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: 'Gratis para siempre - Software Open Source',
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
    url: siteUrl,
    logo: absoluteUrl('/logo.png'),
    parentOrganization: {
      '@type': 'Organization',
      name: 'RocStatus',
      url: 'https://rocstatus.com',
    },
    sameAs: ['https://rocstatus.com', 'https://github.com/vgpastor/RocNest'],
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RocNest',
    url: siteUrl,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  )
}
