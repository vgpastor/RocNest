'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/button'
import {
    CONSENT_PREFERENCES_EVENT,
    CONSENT_CATEGORIES,
    DENY_ALL,
    GRANT_ALL,
    decide,
    parseStoredDecision,
    toChoices,
    toGoogleConsentSignals,
    type ConsentCategory,
    type ConsentChoices,
} from '@/lib/consent/consent'
import {
    readRawConsent,
    readRawConsentOnServer,
    subscribeToConsent,
    writeConsentDecision,
} from '@/lib/consent/consent-storage'

export type ConsentCopy = {
    title: string
    description: string
    policyLink: string
    acceptAll: string
    rejectAll: string
    customize: string
    save: string
    back: string
    categories: Record<ConsentCategory | 'necessary', { title: string; description: string }>
    necessaryAlwaysOn: string
}

/** null means "whatever the stored decision implies": banner if none, hidden if any. */
type OpenPanel = 'preferences' | null

function pushConsentUpdate(choices: ConsentChoices): void {
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer || []
    // Push the raw argument list: gtag() is just a shim over dataLayer.push(arguments),
    // so this reaches the container identically without depending on load order.
    w.dataLayer.push(['consent', 'update', toGoogleConsentSignals(choices)])
}

export function CookieConsent({ copy, locale }: { copy: ConsentCopy; locale: string }) {
    const rawConsent = useSyncExternalStore(
        subscribeToConsent,
        readRawConsent,
        readRawConsentOnServer,
    )
    const storedDecision = useMemo(() => parseStoredDecision(rawConsent), [rawConsent])

    const [openPanel, setOpenPanel] = useState<OpenPanel>(null)
    const [choices, setChoices] = useState<ConsentChoices>(DENY_ALL)

    useEffect(() => {
        const reopen = () => {
            setChoices(storedDecision ? toChoices(storedDecision) : DENY_ALL)
            setOpenPanel('preferences')
        }
        window.addEventListener(CONSENT_PREFERENCES_EVENT, reopen)
        return () => window.removeEventListener(CONSENT_PREFERENCES_EVENT, reopen)
    }, [storedDecision])

    const commit = useCallback((next: ConsentChoices) => {
        pushConsentUpdate(next)
        writeConsentDecision(decide(next))
        setOpenPanel(null)
    }, [])

    const isPreferences = openPanel === 'preferences'
    // Undecided visitors get the banner; the panel can also be reopened later
    // from the footer to withdraw or change consent.
    if (!isPreferences && storedDecision) return null

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="consent-title"
            className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
        >
            <div className="mx-auto max-w-3xl rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-2xl sm:p-6">
                <h2 id="consent-title" className="text-base font-semibold">
                    {copy.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                    {copy.description}{' '}
                    <Link
                        href={`/${locale}/legal/cookies`}
                        className="font-medium text-[var(--color-primary)] hover:underline"
                    >
                        {copy.policyLink}
                    </Link>
                </p>

                {isPreferences && (
                    <ul className="mt-5 space-y-3">
                        <li className="rounded-lg border border-[var(--color-border)] p-3">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium">{copy.categories.necessary.title}</p>
                                    <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                                        {copy.categories.necessary.description}
                                    </p>
                                </div>
                                <span className="shrink-0 text-xs font-medium text-[var(--color-muted-foreground)]">
                                    {copy.necessaryAlwaysOn}
                                </span>
                            </div>
                        </li>

                        {CONSENT_CATEGORIES.map((category) => (
                            <li key={category} className="rounded-lg border border-[var(--color-border)] p-3">
                                <label className="flex items-start justify-between gap-4 cursor-pointer">
                                    <div>
                                        <p className="text-sm font-medium">{copy.categories[category].title}</p>
                                        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                                            {copy.categories[category].description}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                                        checked={choices[category]}
                                        onChange={(e) =>
                                            setChoices((c) => ({ ...c, [category]: e.target.checked }))
                                        }
                                    />
                                </label>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Reject carries the same visual weight as accept: the AEPD treats a
                    harder-to-find refusal as invalid consent. */}
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    {isPreferences ? (
                        <>
                            <Button variant="ghost" onClick={() => setOpenPanel(null)}>
                                {copy.back}
                            </Button>
                            <Button variant="outline" onClick={() => commit(DENY_ALL)}>
                                {copy.rejectAll}
                            </Button>
                            <Button variant="primary" onClick={() => commit(choices)}>
                                {copy.save}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => setOpenPanel('preferences')}>
                                {copy.customize}
                            </Button>
                            <Button variant="outline" onClick={() => commit(DENY_ALL)}>
                                {copy.rejectAll}
                            </Button>
                            <Button variant="primary" onClick={() => commit(GRANT_ALL)}>
                                {copy.acceptAll}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
