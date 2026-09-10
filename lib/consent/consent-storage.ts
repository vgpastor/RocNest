import {
    CONSENT_STORAGE_KEY,
    parseStoredDecision,
    type ConsentDecision,
} from './consent'

/** Dispatched after a local write, so same-tab subscribers re-read. */
const CONSENT_CHANGED_EVENT = 'rocnest:consent-changed'

/**
 * localStorage access for the consent decision.
 *
 * Every call is guarded: Safari in private mode, disabled site data and
 * server-side rendering all make `localStorage` throw or vanish, and none of
 * those should take the page down. Failing to read is treated as "no decision
 * yet", which re-asks — the safe direction.
 */

export function readConsentDecision(): ConsentDecision | null {
    try {
        return parseStoredDecision(window.localStorage.getItem(CONSENT_STORAGE_KEY))
    } catch {
        return null
    }
}

export function writeConsentDecision(decision: ConsentDecision): void {
    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(decision))
    } catch {
        // A visitor who blocks storage still gets their choice applied for this
        // page load; it just cannot be remembered.
    }
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT))
}

/**
 * useSyncExternalStore bindings.
 *
 * The stored decision is external state, so the banner subscribes to it rather
 * than copying it into React state on mount — which would mean rendering the
 * banner to every returning visitor for one frame before hiding it again.
 */
export function subscribeToConsent(onChange: () => void): () => void {
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
        window.removeEventListener(CONSENT_CHANGED_EVENT, onChange)
        window.removeEventListener('storage', onChange)
    }
}

/** Raw snapshot: a string is referentially stable, a parsed object would not be. */
export function readRawConsent(): string | null {
    try {
        return window.localStorage.getItem(CONSENT_STORAGE_KEY)
    } catch {
        return null
    }
}

/** On the server nothing is stored, so nothing is consented. */
export function readRawConsentOnServer(): string | null {
    return null
}
