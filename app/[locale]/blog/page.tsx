import { Metadata } from 'next'
import Link from 'next/link'

import { CATEGORY_SLUGS, categoryPath, getCategoryCopy } from '@/lib/blog/category'
import { getPostSummaries } from '@/lib/blog/repository'
import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n'
import { localeAlternates } from '@/lib/seo'

import { BLOG_COPY } from './copy'
import { PostList } from './PostList'

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

            {/* Los tres territorios, visibles desde la portada del blog: es lo que
                comunica a un lector —y a Google— que esto cubre temas concretos
                en profundidad, y no una mezcla de lo que surja. */}
            <nav aria-label={copy.browseByCategory} className="mt-8">
                <h2 className="text-sm font-semibold">{copy.browseByCategory}</h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                    {CATEGORY_SLUGS.map((slug) => {
                        const category = getCategoryCopy(slug, locale)
                        return (
                            <li key={slug}>
                                <Link
                                    href={categoryPath(slug, locale)}
                                    className="block h-full rounded-lg border border-[var(--color-border)] p-4 hover:border-[var(--color-primary)]/50 transition-colors"
                                >
                                    <span className="text-sm font-semibold">{category.name}</span>
                                    <span className="mt-1 block text-xs leading-relaxed text-[var(--color-muted-foreground)]">
                                        {category.description}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <PostList posts={posts} locale={locale} copy={copy} />
        </div>
    )
}
