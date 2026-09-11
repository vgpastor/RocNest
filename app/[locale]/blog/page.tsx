import { Metadata } from 'next'
import Link from 'next/link'

import { getPostSummaries } from '@/lib/blog/repository'
import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n'
import { localeAlternates } from '@/lib/seo'

import { BLOG_COPY } from './copy'

type PageParams = { locale: string }

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<PageParams>
}): Promise<Metadata> {
    const { locale: raw } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    const copy = BLOG_COPY[locale]

    return {
        title: copy.indexTitle,
        description: copy.indexDescription,
        alternates: localeAlternates(locale, '/blog'),
        openGraph: { type: 'website', title: copy.indexTitle, description: copy.indexDescription },
    }
}

export default async function BlogIndexPage({ params }: { params: Promise<PageParams> }) {
    const { locale: raw } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    const copy = BLOG_COPY[locale]
    const posts = await getPostSummaries(locale)

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{copy.indexHeading}</h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-muted-foreground)]">
                {copy.indexIntro}
            </p>

            {posts.length === 0 ? (
                <p className="mt-12 text-[var(--color-muted-foreground)]">{copy.empty}</p>
            ) : (
                <ul className="mt-12 space-y-10">
                    {posts.map((post) => (
                        <li key={post.slug}>
                            <article>
                                <p className="text-xs text-[var(--color-muted-foreground)]">
                                    <time dateTime={post.date}>
                                        {new Date(post.date).toLocaleDateString(
                                            locale === 'es' ? 'es-ES' : 'en-GB',
                                            { day: 'numeric', month: 'long', year: 'numeric' },
                                        )}
                                    </time>
                                    {' · '}
                                    {post.readingMinutes} {copy.readingMinutes}
                                </p>
                                <h2 className="mt-1 text-xl font-bold">
                                    <Link
                                        href={`/${locale}/blog/${post.slug}`}
                                        className="hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="mt-2 leading-relaxed text-[var(--color-muted-foreground)]">
                                    {post.description}
                                </p>
                                <Link
                                    href={`/${locale}/blog/${post.slug}`}
                                    className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline"
                                >
                                    {copy.readMore} &rarr;
                                </Link>
                            </article>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
