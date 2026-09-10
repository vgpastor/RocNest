import { describe, expect, it } from 'vitest'

import {
    CONSENT_VERSION,
    DEFAULT_CONSENT,
    DENY_ALL,
    GRANT_ALL,
    decide,
    parseStoredDecision,
    toChoices,
    toGoogleConsentSignals,
} from '../consent/consent'

describe('DEFAULT_CONSENT', () => {
    it('denies everything except strictly necessary storage', () => {
        expect(DEFAULT_CONSENT).toEqual({
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            personalization_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
        })
    })
})

describe('toGoogleConsentSignals', () => {
    it('grants analytics storage only when analytics is accepted', () => {
        expect(toGoogleConsentSignals({ analytics: true, marketing: false })).toMatchObject({
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
        })
    })

    it('maps marketing onto every advertising signal', () => {
        expect(toGoogleConsentSignals({ analytics: false, marketing: true })).toMatchObject({
            analytics_storage: 'denied',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            personalization_storage: 'granted',
        })
    })

    it('never revokes strictly necessary storage', () => {
        for (const choices of [DENY_ALL, GRANT_ALL]) {
            expect(toGoogleConsentSignals(choices)).toMatchObject({
                functionality_storage: 'granted',
                security_storage: 'granted',
            })
        }
    })
})

describe('decide', () => {
    it('stamps the schema version and the instant of the decision', () => {
        const now = new Date('2026-09-10T10:00:00.000Z')
        expect(decide(GRANT_ALL, now)).toEqual({
            analytics: true,
            marketing: true,
            version: CONSENT_VERSION,
            decidedAt: '2026-09-10T10:00:00.000Z',
        })
    })
})

describe('parseStoredDecision', () => {
    const valid = JSON.stringify(decide(GRANT_ALL, new Date('2026-09-10T10:00:00.000Z')))

    it('round-trips a decision it wrote', () => {
        expect(toChoices(parseStoredDecision(valid)!)).toEqual(GRANT_ALL)
    })

    // Anything untrustworthy must re-prompt rather than be read as consent.
    it.each([
        ['nothing stored', null],
        ['empty string', ''],
        ['malformed JSON', '{oops'],
        ['a bare string', '"granted"'],
        ['null literal', 'null'],
        ['an older schema', JSON.stringify({ analytics: true, marketing: true, version: 0, decidedAt: 'x' })],
        ['a missing category', JSON.stringify({ analytics: true, version: CONSENT_VERSION, decidedAt: 'x' })],
        ['a non-boolean category', JSON.stringify({ analytics: 'yes', marketing: false, version: CONSENT_VERSION, decidedAt: 'x' })],
        ['a missing timestamp', JSON.stringify({ analytics: true, marketing: true, version: CONSENT_VERSION })],
    ])('returns null for %s', (_label, raw) => {
        expect(parseStoredDecision(raw as string | null)).toBeNull()
    })

    it('preserves a stored rejection', () => {
        const stored = JSON.stringify(decide(DENY_ALL, new Date()))
        expect(toChoices(parseStoredDecision(stored)!)).toEqual(DENY_ALL)
    })
})
