'use client'

import { CONSENT_PREFERENCES_EVENT } from '@/lib/consent/consent'

/**
 * Reopens the preferences panel. GDPR art. 7.3 requires withdrawing consent to
 * be as easy as giving it, so this sits in the footer on every page.
 */
export function ConsentPreferencesLink({ label }: { label: string }) {
    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(CONSENT_PREFERENCES_EVENT))}
            className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
            {label}
        </button>
    )
}
