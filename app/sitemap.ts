import { MetadataRoute } from 'next'

import { CATEGORY_SLUGS } from '@/lib/blog/category'
import { getPostSummaries } from '@/lib/blog/repository'
import { locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl

  const publicPages = ['', '/features', '/pricing', '/about', '/blog',
    ...CATEGORY_SLUGS.map((slug) => `/blog/category/${slug}`), '/legal/privacy', '/legal/cookies', '/legal/terms']

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

  // Blog posts: cada artículo con su fecha real de publicación, y hreflang solo
  // hacia los idiomas en los que existe.
  const postsByLocale = await Promise.all(
    locales.map(async (locale) => ({ locale, posts: await getPostSummaries(locale) }))
  )
  const translations = new Map<string, { locale: string; slug: string }[]>()
  for (const { locale, posts } of postsByLocale) {
    for (const post of posts) {
      translations.set(post.translationKey, [
        ...(translations.get(post.translationKey) ?? []),
        { locale, slug: post.slug },
      ])
    }
  }
  for (const { locale, posts } of postsByLocale) {
    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'yearly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            (translations.get(post.translationKey) ?? []).map((t) => [
              t.locale,
              `${baseUrl}/${t.locale}/blog/${t.slug}`,
            ])
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
