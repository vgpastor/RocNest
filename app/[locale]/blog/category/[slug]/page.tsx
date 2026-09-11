import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CATEGORY_SLUGS, getCategoryCopy, isValidCategory } from '@/lib/blog/category'
import { getPostSummariesByCategory } from '@/lib/blog/repository'
import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n'
import { localeAlternates } from '@/lib/seo'

import { BLOG_COPY } from '../../copy'
import { PostList } from '../../PostList'

type PageParams = { locale: string; slug: string }

export async function generateStaticParams() {
    return locales.flatMap((locale) => CATEGORY_SLUGS.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<PageParams>
}): Promise<Metadata> {
    const { locale: raw, slug } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    if (!isValidCategory(slug)) return {}

    const category = getCategoryCopy(slug, locale)

    return {
        title: category.name,
        description: category.description,
        alternates: localeAlternates(locale, `/blog/category/${slug}`),
        openGraph: { type: 'website', title: category.name, description: category.description },
    }
}

export default async function BlogCategoryPage({ params }: { params: Promise<PageParams> }) {
    const { locale: raw, slug } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    if (!isValidCategory(slug)) notFound()

    const copy = BLOG_COPY[locale]
    const category = getCategoryCopy(slug, locale)
    const posts = await getPostSummariesByCategory(locale, slug)

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <Link
                href={`/${locale}/blog`}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
                &larr; {copy.backToBlog}
            </Link>

            <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight">{category.name}</h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-muted-foreground)]">
                {category.description}
            </p>

            <PostList posts={posts} locale={locale} copy={copy} />
        </div>
    )
}
