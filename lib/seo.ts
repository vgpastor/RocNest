import type { Metadata } from 'next'

import { defaultLocale, locales, type Locale } from './i18n'
import { absoluteUrl } from './site-url'

/**
 * Canonical + hreflang block for a localized page.
 *
 * Every public page needs the same shape (self-referencing canonical, one
 * alternate per locale, and an x-default pointing at the default locale), so it
 * is built once here rather than re-derived in each `generateMetadata`.
 *
 * @param locale the locale being rendered
 * @param path   route below the locale segment, '' for the locale home
 */
export function localeAlternates(locale: Locale, path = ''): Metadata['alternates'] {
    const languages: Record<string, string> = {}
    for (const supported of locales) {
        languages[supported] = absoluteUrl(`/${supported}${path}`)
    }
    languages['x-default'] = absoluteUrl(`/${defaultLocale}${path}`)

    return {
        canonical: absoluteUrl(`/${locale}${path}`),
        languages,
    }
}
