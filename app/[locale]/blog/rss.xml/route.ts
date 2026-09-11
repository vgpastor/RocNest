import { getPostSummaries } from '@/lib/blog/repository'
import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n'
import { absoluteUrl } from '@/lib/site-url'

import { BLOG_COPY } from '../copy'

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

/** &, <, > y las comillas rompen el XML si no se escapan. */
function escapeXml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ locale: string }> },
) {
    const { locale: raw } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    const copy = BLOG_COPY[locale]
    const posts = await getPostSummaries(locale)
    const feedUrl = absoluteUrl(`/${locale}/blog/rss.xml`)

    const items = posts
        .map((post) => {
            const url = absoluteUrl(`/${locale}/blog/${post.slug}`)
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <author>${escapeXml(post.author)}</author>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`
        })
        .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RocNest — ${escapeXml(copy.indexTitle)}</title>
    <link>${absoluteUrl(`/${locale}/blog`)}</link>
    <description>${escapeXml(copy.indexDescription)}</description>
    <language>${locale === 'es' ? 'es-ES' : 'en-US'}</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600, must-revalidate',
        },
    })
}
