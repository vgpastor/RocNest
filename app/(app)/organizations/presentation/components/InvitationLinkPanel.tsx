'use client'

// Presentation - Molecule
// Shows the generated invitation link and whether the email went out.

import { CheckCircle, Copy } from 'lucide-react'
import { toast } from 'sonner'

import { Button, Input } from '@/components/ui'

export interface InvitationLinkPanelProps {
    invitationLink: string
    email: string
    emailSent: boolean
}

export function InvitationLinkPanel({ invitationLink, email, emailSent }: InvitationLinkPanelProps) {
    async function copyLink() {
        try {
            await navigator.clipboard.writeText(invitationLink)
            toast.success('Enlace de invitación copiado')
        } catch {
            toast.error('No se pudo copiar el enlace')
        }
    }

    return (
        <div className="mt-4 p-4 rounded-lg border border-[var(--color-success)]/30 bg-[var(--color-success-bg)]">
            <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[var(--color-success)] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                    <p className="font-medium">
                        {emailSent ? `Invitación enviada a ${email}` : 'Invitación creada'}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                        {emailSent
                            ? 'También puedes compartir este enlace directamente:'
                            : 'No se pudo enviar el email. Comparte este enlace con la persona invitada:'}
                    </p>
                    <div className="flex gap-2 items-start">
                        <Input
                            value={invitationLink}
                            readOnly
                            aria-label="Enlace de invitación"
                            className="font-mono text-xs"
                        />
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={copyLink}
                            aria-label="Copiar enlace de invitación"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
