import type { ConsentCategory } from '@/lib/consent/consent'

/**
 * Inventario de cookies y almacenamiento local.
 *
 * Verificado contra el codigo (`lib/auth/session.ts`,
 * `lib/organization-cookie.ts`, `lib/consent/consent.ts`) y contra lo que el
 * navegador guarda realmente en produccion. La AEPD exige detallar cada cookie,
 * su finalidad, su titular y su duracion, asi que esta lista debe actualizarse
 * cuando se anada o quite alguna.
 */

export type CookieCategory = 'necessary' | ConsentCategory

export type CookieEntry = {
    name: string
    owner: string
    category: CookieCategory
    /** Clave de i18n con la finalidad. */
    purposeKey: string
    /** Clave de i18n con la duracion. */
    durationKey: string
}

export const COOKIE_INVENTORY: readonly CookieEntry[] = [
    {
        name: 'session',
        owner: 'RocNest',
        category: 'necessary',
        purposeKey: 'session',
        durationKey: 'sevenDays',
    },
    {
        name: 'current-organization',
        owner: 'RocNest',
        category: 'necessary',
        purposeKey: 'currentOrganization',
        durationKey: 'session',
    },
    {
        name: 'rocnest.consent',
        owner: 'RocNest',
        category: 'necessary',
        purposeKey: 'consent',
        durationKey: 'localStoragePersistent',
    },
    {
        name: '_ga',
        owner: 'Google LLC',
        category: 'analytics',
        purposeKey: 'gaUser',
        durationKey: 'twoYears',
    },
    {
        name: '_ga_J64Y4W87JX',
        owner: 'Google LLC',
        category: 'analytics',
        purposeKey: 'gaSession',
        durationKey: 'twoYears',
    },
] as const
