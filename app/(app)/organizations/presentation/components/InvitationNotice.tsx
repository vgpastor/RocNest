// Presentation - Molecule
// Terminal state of an invitation (not found, expired, already accepted...).

import Link from 'next/link'

import { Card, CardContent } from '@/components/ui'

export type InvitationNoticeTone = 'error' | 'warning'

export interface InvitationNoticeProps {
    title: string
    description: string
    hint?: string
    action?: { href: string; label: string }
    tone: InvitationNoticeTone
}

const TONE_CLASS: Record<InvitationNoticeTone, string> = {
    error: 'text-[var(--color-destructive)]',
    warning: 'text-[var(--color-warning,#b45309)]',
}

export function InvitationNotice({ title, description, hint, action, tone }: InvitationNoticeProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
            <Card className="max-w-md w-full">
                <CardContent className="text-center space-y-3 py-8">
                    <h1 className={`text-2xl font-bold ${TONE_CLASS[tone]}`}>{title}</h1>
                    <p className="text-[var(--color-muted-foreground)]">{description}</p>
                    {hint && <p className="text-sm text-[var(--color-muted-foreground)]">{hint}</p>}
                    {action && (
                        <Link
                            href={action.href}
                            className="inline-block text-[var(--color-primary)] hover:underline font-medium"
                        >
                            {action.label}
                        </Link>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
