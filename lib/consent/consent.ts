/**
 * Consent domain — Google Consent Mode v2.
 *
 * Pure: no DOM, no storage, no side effects. The browser-facing pieces
 * (localStorage in `consent-storage.ts`, the gtag bridge in the banner)
 * depend on this module, never the other way round.
 */

/** Categories the visitor can decide on. Strictly necessary is not a choice. */
export const CONSENT_CATEGORIES = ['analytics', 'marketing'] as const
export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number]

export type ConsentChoices = Record<ConsentCategory, boolean>

export type ConsentDecision = ConsentChoices & {
    /** Schema version, so a change in what we ask can re-prompt. */
    version: number
    /** ISO-8601 instant the visitor decided. Evidence of consent under GDPR. */
    decidedAt: string
}

/** Bump when the categories or their meaning change: stored decisions re-prompt. */
export const CONSENT_VERSION = 1

export const CONSENT_STORAGE_KEY = 'rocnest.consent'

/** Fired to reopen the preferences panel (footer link, "withdraw consent"). */
export const CONSENT_PREFERENCES_EVENT = 'rocnest:consent-preferences'

export const DENY_ALL: ConsentChoices = { analytics: false, marketing: false }
export const GRANT_ALL: ConsentChoices = { analytics: true, marketing: true }

type ConsentSignal = 'granted' | 'denied'

/** The Consent Mode v2 signal names we set. */
export type GoogleConsentSignals = {
    ad_storage: ConsentSignal
    ad_user_data: ConsentSignal
    ad_personalization: ConsentSignal
    analytics_storage: ConsentSignal
    functionality_storage: ConsentSignal
    personalization_storage: ConsentSignal
    security_storage: ConsentSignal
}

function signal(granted: boolean): ConsentSignal {
    return granted ? 'granted' : 'denied'
}

/**
 * State before the visitor decides: everything denied except what the site
 * cannot work without. Under Spanish law (LSSI art. 22.2) only strictly
 * necessary storage may be used without prior consent.
 */
export const DEFAULT_CONSENT: GoogleConsentSignals = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
}

export function toGoogleConsentSignals(choices: ConsentChoices): GoogleConsentSignals {
    return {
        ...DEFAULT_CONSENT,
        analytics_storage: signal(choices.analytics),
        ad_storage: signal(choices.marketing),
        ad_user_data: signal(choices.marketing),
        ad_personalization: signal(choices.marketing),
        personalization_storage: signal(choices.marketing),
    }
}

export function decide(choices: ConsentChoices, now: Date = new Date()): ConsentDecision {
    return { ...choices, version: CONSENT_VERSION, decidedAt: now.toISOString() }
}

/**
 * Rebuild a decision from whatever is in storage.
 *
 * Returns null for anything we cannot trust — absent, malformed, or written by
 * an older schema — so the caller asks again rather than assuming consent.
 */
export function parseStoredDecision(raw: string | null): ConsentDecision | null {
    if (!raw) return null

    let parsed: unknown
    try {
        parsed = JSON.parse(raw)
    } catch {
        return null
    }

    if (typeof parsed !== 'object' || parsed === null) return null
    const candidate = parsed as Record<string, unknown>

    if (candidate.version !== CONSENT_VERSION) return null
    if (typeof candidate.decidedAt !== 'string') return null
    if (CONSENT_CATEGORIES.some((c) => typeof candidate[c] !== 'boolean')) return null

    return {
        analytics: candidate.analytics as boolean,
        marketing: candidate.marketing as boolean,
        version: CONSENT_VERSION,
        decidedAt: candidate.decidedAt,
    }
}

export function toChoices(decision: ConsentDecision): ConsentChoices {
    return { analytics: decision.analytics, marketing: decision.marketing }
}
