import { redirect } from 'next/navigation'

import { organizationsModule } from '@/app/(app)/organizations/infrastructure/container'
import { AcceptInvitationCard } from '@/app/(app)/organizations/presentation/components/AcceptInvitationCard'
import { InvitationNotice } from '@/app/(app)/organizations/presentation/components/InvitationNotice'
import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { getSessionUser, refreshSessionCookie } from '@/lib/auth/session'

const APP_HOME = '/catalog'

function acceptUrl(token: string) {
    return `/invitations/accept?token=${encodeURIComponent(token)}`
}

function loginUrl(token: string) {
    return `/login?from=${encodeURIComponent(acceptUrl(token))}`
}

/**
 * Joining runs as a Server Action, never while rendering: it writes cookies (active
 * organization and a refreshed session token) and Next.js only allows that from a
 * Server Action or a Route Handler.
 */
async function acceptInvitation(formData: FormData) {
    'use server'

    const token = String(formData.get('token') ?? '')
    const sessionUser = await getSessionUser()

    if (!sessionUser) {
        redirect(loginUrl(token))
    }

    const result = await organizationsModule().acceptInvitation.execute({
        token,
        userId: sessionUser.userId,
    })

    await OrganizationContextService.setCurrentOrganizationId(result.organizationId)

    // Without this the middleware would compare the active organization against a
    // stale token and bounce the new member back to /organizations/select.
    await refreshSessionCookie(sessionUser.userId, sessionUser.email, result.organizationIds)

    redirect(APP_HOME)
}

export default async function AcceptInvitationPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) {
    const { token } = await searchParams

    if (!token) {
        return (
            <InvitationNotice
                tone="error"
                title="Token inválido"
                description="No se proporcionó un token de invitación"
            />
        )
    }

    const sessionUser = await getSessionUser()

    if (!sessionUser) {
        redirect(loginUrl(token))
    }

    const state = await organizationsModule().getInvitation.execute(token, sessionUser.userId)

    switch (state.status) {
        case 'not-found':
            return (
                <InvitationNotice
                    tone="error"
                    title="Invitación no encontrada"
                    description="El token de invitación no es válido"
                />
            )

        case 'already-accepted':
            return (
                <InvitationNotice
                    tone="warning"
                    title="Invitación ya aceptada"
                    description="Esta invitación ya fue aceptada previamente"
                    action={{ href: APP_HOME, label: 'Ir a la aplicación' }}
                />
            )

        case 'expired':
            return (
                <InvitationNotice
                    tone="error"
                    title="Invitación expirada"
                    description={`Esta invitación expiró el ${state.invitation.expiresAt.toLocaleDateString('es-ES')}`}
                    hint="Solicita una nueva invitación al administrador"
                />
            )

        case 'already-member':
            return (
                <InvitationNotice
                    tone="warning"
                    title="Ya eres miembro"
                    description={`Ya perteneces a la organización ${state.invitation.organization.name}`}
                    action={{ href: APP_HOME, label: 'Ir a la aplicación' }}
                />
            )

        case 'acceptable':
            return (
                <AcceptInvitationCard
                    token={token}
                    organizationName={state.invitation.organization.name}
                    roleLabel={state.invitation.role.label}
                    onAccept={acceptInvitation}
                />
            )
    }
}
