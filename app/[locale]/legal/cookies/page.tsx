import { Metadata } from 'next'

import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n'
import { localeAlternates } from '@/lib/seo'

import { getLegalContent } from '../content'
import { COOKIE_INVENTORY } from '../cookie-inventory'
import { LegalDocumentLayout } from '../LegalDocument'

import { CookiePreferencesButton } from './CookiePreferencesButton'


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
    const { cookies } = getLegalContent(locale)

    return {
        title: cookies.title,
        description: cookies.intro,
        alternates: localeAlternates(locale, '/legal/cookies'),
    }
}

export default async function CookiesPage({ params }: { params: Promise<PageParams> }) {
    const { locale: raw } = await params
    const locale = (isValidLocale(raw) ? raw : defaultLocale) as Locale
    const { cookies, incompleteWarning } = getLegalContent(locale)

    return (
        <LegalDocumentLayout
            title={cookies.title}
            updated={cookies.updated}
            updatedLabel={locale === 'es' ? 'Última actualización:' : 'Last updated:'}
            intro={cookies.intro}
            sections={cookies.sections}
            warning={incompleteWarning}
        >
            <section className="mt-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border)]">
                                <th scope="col" className="py-2 pr-4 font-semibold">{cookies.tableHeadings.name}</th>
                                <th scope="col" className="py-2 pr-4 font-semibold">{cookies.tableHeadings.owner}</th>
                                <th scope="col" className="py-2 pr-4 font-semibold">{cookies.tableHeadings.category}</th>
                                <th scope="col" className="py-2 pr-4 font-semibold">{cookies.tableHeadings.purpose}</th>
                                <th scope="col" className="py-2 font-semibold">{cookies.tableHeadings.duration}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COOKIE_INVENTORY.map((cookie) => (
                                <tr key={cookie.name} className="border-b border-[var(--color-border)] align-top">
                                    <td className="py-3 pr-4 font-mono text-xs">{cookie.name}</td>
                                    <td className="py-3 pr-4">{cookie.owner}</td>
                                    <td className="py-3 pr-4">{cookies.categories[cookie.category]}</td>
                                    <td className="py-3 pr-4 text-[var(--color-muted-foreground)]">
                                        {cookies.purposes[cookie.purposeKey]}
                                    </td>
                                    <td className="py-3 text-[var(--color-muted-foreground)]">
                                        {cookies.durations[cookie.durationKey]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8">
                    <CookiePreferencesButton label={cookies.manageCta} />
                </div>
            </section>
        </LegalDocumentLayout>
    )
}
