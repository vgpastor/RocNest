import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { categoryPath, getCategoryCopy } from '@/lib/blog/category'
import { getPost, getPostSummaries, getTranslations } from '@/lib/blog/repository'
import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n'
import { absoluteUrl } from '@/lib/site-url'

import { BLOG_COPY } from '../copy'

type PageParams = { locale: string; slug: string }

export async function generateStaticParams() {
    const params = await Promise.all(
        locales.map(async (locale) => {
            const posts = await getPostSummaries(locale)
            return posts.map((post) => ({ locale, slug: post.slug }))
        }),
    )
    return params.flat()
}

export async function generateMetadata({
    params,
}: {
    params: Promise<PageParams>
}): Promise<Metadata> {
    const { locale: raw, slug } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    const post = await getPost(locale, slug)
    if (!post) return {}

    // hreflang solo hacia las traducciones que existen de verdad, y con el slug
    // de cada idioma: apuntar a una traducción inexistente es peor que callar.
    const translations = await getTranslations(post.translationKey, locales)
    const languages: Record<string, string> = {}
    for (const translation of translations) {
        languages[translation.locale] = absoluteUrl(`/${translation.locale}/blog/${translation.slug}`)
    }
    const fallback = translations.find((t) => t.locale === defaultLocale)
    if (fallback) {
        languages['x-default'] = absoluteUrl(`/${defaultLocale}/blog/${fallback.slug}`)
    }

    return {
        title: post.title,
        description: post.description,
        keywords: post.tags.join(', '),
        authors: [{ name: post.author }],
        alternates: { canonical: absoluteUrl(`/${locale}/blog/${slug}`), languages },
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.description,
            url: absoluteUrl(`/${locale}/blog/${slug}`),
            publishedTime: post.date,
            authors: [post.author],
            tags: post.tags,
        },
        twitter: { card: 'summary_large_image', title: post.title, description: post.description },
    }
}

export default async function BlogPostPage({ params }: { params: Promise<PageParams> }) {
    const { locale: raw, slug } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    const post = await getPost(locale, slug)
    if (!post) notFound()

    const copy = BLOG_COPY[locale]
    const category = getCategoryCopy(post.category, locale)
    const url = absoluteUrl(`/${locale}/blog/${slug}`)

    const blogPosting = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: locale === 'es' ? 'es-ES' : 'en-US',
        keywords: post.tags.join(', '),
        articleSection: category.name,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        url,
        author: { '@type': 'Person', name: post.author },
        publisher: {
            '@type': 'Organization',
            name: 'RocNest',
            url: absoluteUrl(),
            logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
        },
    }

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'RocNest', item: absoluteUrl(`/${locale}`) },
            { '@type': 'ListItem', position: 2, name: copy.indexHeading, item: absoluteUrl(`/${locale}/blog`) },
            {
                '@type': 'ListItem',
                position: 3,
                name: category.name,
                item: absoluteUrl(categoryPath(post.category, locale)),
            },
            { '@type': 'ListItem', position: 4, name: post.title, item: url },
        ],
    }

    return (
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
            />

            <Link
                href={`/${locale}/blog`}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
                &larr; {copy.backToBlog}
            </Link>

            <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                {post.title}
            </h1>

            {/* La fecha no se muestra —el contenido es atemporal— pero sigue
                declarandose en el JSON-LD de abajo y en el RSS, con su valor real. */}
            <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
                {copy.by} {post.author} · {post.readingMinutes} {copy.readingMinutes} ·{' '}
                <Link
                    href={categoryPath(post.category, locale)}
                    className="font-medium text-[var(--color-primary)] hover:underline"
                >
                    {category.name}
                </Link>
            </p>

            {post.tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <li
                            key={tag}
                            className="rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            )}

            <div
                className="blog-content mt-10"
                dangerouslySetInnerHTML={{ __html: post.html }}
            />
        </article>
    )
}
