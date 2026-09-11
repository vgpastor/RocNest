import { Metadata } from 'next'

import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n'
import { localeAlternates } from '@/lib/seo'

import { getLegalContent } from '../content'
import { LegalDocumentLayout } from '../LegalDocument'

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
    const { terms } = getLegalContent(locale)

    return {
        title: terms.title,
        description: terms.intro,
        alternates: localeAlternates(locale, '/legal/terms'),
    }
}

export default async function TermsPage({ params }: { params: Promise<PageParams> }) {
    const { locale: raw } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    const { terms, incompleteWarning } = getLegalContent(locale)

    return (
        <LegalDocumentLayout
            title={terms.title}
            updated={terms.updated}
            updatedLabel={locale === 'es' ? 'Última actualización:' : 'Last updated:'}
            intro={terms.intro}
            sections={terms.sections}
            warning={incompleteWarning}
        />
    )
}
