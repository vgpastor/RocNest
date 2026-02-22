import { MetadataRoute } from 'next'

import { locales } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rocnest.app'

  const publicPages = ['', '/features', '/pricing', '/about']

  const entries: MetadataRoute.Sitemap = []

  // Root URL
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  })

  // Locale-specific public pages
  for (const locale of locales) {
    for (const page of publicPages) {
      const isHome = page === ''
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: isHome ? 'weekly' : 'monthly',
        priority: isHome ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      })
    }
  }

  // Auth pages
  entries.push({
    url: `${baseUrl}/login`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  })

  entries.push({
    url: `${baseUrl}/register`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  })

  return entries
}
