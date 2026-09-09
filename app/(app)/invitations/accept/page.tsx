import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui'
import { getSessionUser, refreshSessionCookie } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

const CURRENT_ORGANIZATION_COOKIE = 'current-organization'

function acceptUrl(token: string) {
    return `/invitations/accept?token=${encodeURIComponent(token)}`
}

function Message({
    title,
    tone,
    children,
}: {
    title: string
    tone: 'error' | 'warning'
    children?: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4 max-w-md">
                <h1
                    className={`text-2xl font-bold ${tone === 'error' ? 'text-red-600' : 'text-amber-600'}`}
                >
                    {title}
                </h1>
                {children}
            </div>
        </div>
    )
}

/**
 * Joins the invited user to the organization.
 * This runs as a Server Action (not while rendering) because it writes cookies:
 * both the active organization and a fresh session token that includes the new
 * organization, without which the middleware would bounce the user back to
 * /organizations/select on every request.
 */
async function acceptInvitation(formData: FormData) {
    'use server'

    const token = String(formData.get('token') ?? '')
    const sessionUser = await getSessionUser()

    if (!sessionUser) {
        redirect(`/login?from=${encodeURIComponent(acceptUrl(token))}`)
    }

    const invitation = await prisma.organizationInvitation.findUnique({
        where: { token },
    })

    // Re-render the page so it explains why (missing / expired / already accepted)
    if (!invitation || invitation.acceptedAt || invitation.expiresAt < new Date()) {
        redirect(acceptUrl(token))
    }

    await prisma.$transaction(async (tx) => {
        // upsert: a double click on the button must not blow up with a unique violation
        await tx.userOrganization.upsert({
            where: {
                userId_organizationId: {
                    userId: sessionUser.userId,
                    organizationId: invitation.organizationId,
                },
            },
            update: {},
            create: {
                userId: sessionUser.userId,
                organizationId: invitation.organizationId,
                role: invitation.role,
            },
        })

        await tx.organizationInvitation.update({
            where: { id: invitation.id },
            data: { acceptedAt: new Date() },
        })
    })

    const memberships = await prisma.userOrganization.findMany({
        where: { userId: sessionUser.userId },
        select: { organizationId: true },
    })

    const cookieStore = await cookies()
    cookieStore.set(CURRENT_ORGANIZATION_COOKIE, invitation.organizationId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
    })

    await refreshSessionCookie(
        sessionUser.userId,
        sessionUser.email,
        memberships.map((m) => m.organizationId)
    )

    redirect('/catalog')
}

export default async function AcceptInvitationPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) {
    const { token } = await searchParams

    if (!token) {
        return (
            <Message title="Token Inválido" tone="error">
                <p className="text-muted-foreground">No se proporcionó un token de invitación</p>
            </Message>
        )
    }

    const sessionUser = await getSessionUser()

    if (!sessionUser) {
        redirect(`/login?from=${encodeURIComponent(acceptUrl(token))}`)
    }

    const invitation = await prisma.organizationInvitation.findUnique({
        where: { token },
        include: { organization: true },
    })

    if (!invitation) {
        return (
            <Message title="Invitación No Encontrada" tone="error">
                <p className="text-muted-foreground">El token de invitación no es válido</p>
            </Message>
        )
    }

    if (invitation.acceptedAt) {
        return (
            <Message title="Invitación Ya Aceptada" tone="warning">
                <p className="text-muted-foreground">Esta invitación ya fue aceptada previamente</p>
                <Link href="/catalog" className="text-primary hover:underline">
                    Ir a la aplicación
                </Link>
            </Message>
        )
    }

    if (invitation.expiresAt < new Date()) {
        return (
            <Message title="Invitación Expirada" tone="error">
                <p className="text-muted-foreground">
                    Esta invitación expiró el {invitation.expiresAt.toLocaleDateString('es-ES')}
                </p>
                <p className="text-sm text-muted-foreground">
                    Solicita una nueva invitación al administrador
                </p>
            </Message>
        )
    }

    const existingMembership = await prisma.userOrganization.findUnique({
        where: {
            userId_organizationId: {
                userId: sessionUser.userId,
                organizationId: invitation.organizationId,
            },
        },
    })

    if (existingMembership) {
        return (
            <Message title="Ya Eres Miembro" tone="warning">
                <p className="text-muted-foreground">
                    Ya perteneces a la organización {invitation.organization.name}
                </p>
                <Link href="/catalog" className="text-primary hover:underline">
                    Ir a la aplicación
                </Link>
            </Message>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-6 max-w-md">
                <div className="text-6xl">🎉</div>
                <h1 className="text-3xl font-bold">Invitación a {invitation.organization.name}</h1>
                <p className="text-muted-foreground">
                    Te han invitado como{' '}
                    <strong>{invitation.role === 'admin' ? 'administrador' : 'miembro'}</strong> de{' '}
                    {invitation.organization.name}.
                </p>
                <form action={acceptInvitation}>
                    <input type="hidden" name="token" value={token} />
                    <Button type="submit">Unirme a {invitation.organization.name}</Button>
                </form>
            </div>
        </div>
    )
}
