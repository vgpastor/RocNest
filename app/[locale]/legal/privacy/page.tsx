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
    const { privacy } = getLegalContent(locale)

    return {
        title: privacy.title,
        description: privacy.intro,
        alternates: localeAlternates(locale, '/legal/privacy'),
    }
}

export default async function PrivacyPage({ params }: { params: Promise<PageParams> }) {
    const { locale: raw } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    const { privacy, incompleteWarning } = getLegalContent(locale)

    return (
        <LegalDocumentLayout
            title={privacy.title}
            updated={privacy.updated}
            updatedLabel={locale === 'es' ? 'Última actualización:' : 'Last updated:'}
            intro={privacy.intro}
            sections={privacy.sections}
            warning={incompleteWarning}
        />
    )
}
