'use client'

import { Button } from '@/components/ui/button'
import { CONSENT_PREFERENCES_EVENT } from '@/lib/consent/consent'

export function CookiePreferencesButton({ label }: { label: string }) {
    return (
        <Button
            variant="outline"
            onClick={() => window.dispatchEvent(new Event(CONSENT_PREFERENCES_EVENT))}
        >
            {label}
        </Button>
    )
}
