// Presentation - Organism
// Acceptance form. Plain <form action={serverAction}> so it also works before
// hydration - the invitee may be on a slow connection.

import { Card, CardContent, Button } from '@/components/ui'

export interface AcceptInvitationCardProps {
    token: string
    organizationName: string
    roleLabel: string
    onAccept: (formData: FormData) => Promise<void>
}

export function AcceptInvitationCard({
    token,
    organizationName,
    roleLabel,
    onAccept,
}: AcceptInvitationCardProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
            <Card className="max-w-md w-full">
                <CardContent className="text-center space-y-6 py-8">
                    <div className="text-5xl" aria-hidden="true">
                        🎉
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Invitación a {organizationName}</h1>
                        <p className="text-[var(--color-muted-foreground)]">
                            Te han invitado como <strong>{roleLabel}</strong> de {organizationName}.
                        </p>
                    </div>
                    <form action={onAccept}>
                        <input type="hidden" name="token" value={token} />
                        <Button type="submit">Unirme a {organizationName}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
