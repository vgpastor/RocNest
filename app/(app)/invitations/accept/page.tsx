import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export default async function AcceptInvitationPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) {
    const { token } = await searchParams

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-red-600">Token Inválido</h1>
                    <p className="text-muted-foreground">No se proporcionó un token de invitación</p>
                </div>
            </div>
        )
    }

    // Get authenticated user
    const sessionUser = await getSessionUser()

    if (!sessionUser) {
        // Store the invitation token and redirect to login
        const cookieStore = await cookies()
        cookieStore.set('pending-invitation', token, {
            httpOnly: true,
            maxAge: 60 * 60 // 1 hour
        })
        redirect('/login')
    }

    // Find the invitation
    const invitation = await prisma.organizationInvitation.findUnique({
        where: { token },
        include: {
            organization: true
        }
    })

    if (!invitation) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-red-600">Invitación No Encontrada</h1>
                    <p className="text-muted-foreground">El token de invitación no es válido</p>
                </div>
            </div>
        )
    }

    // Check if already accepted
    if (invitation.acceptedAt) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-amber-600">Invitación Ya Aceptada</h1>
                    <p className="text-muted-foreground">
                        Esta invitación ya fue aceptada previamente
                    </p>
                    <Link href="/" className="text-primary hover:underline">
                        Ir al Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    // Check if expired
    if (invitation.expiresAt < new Date()) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-red-600">Invitación Expirada</h1>
                    <p className="text-muted-foreground">
                        Esta invitación expiró el {invitation.expiresAt.toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Solicita una nueva invitación al administrador
                    </p>
                </div>
            </div>
        )
    }

    // Check if user already belongs to the organization
    const existingMembership = await prisma.userOrganization.findUnique({
        where: {
            userId_organizationId: {
                userId: sessionUser.userId,
                organizationId: invitation.organizationId
            }
        }
    })

    if (existingMembership) {
        // Mark invitation as accepted anyway
        await prisma.organizationInvitation.update({
            where: { id: invitation.id },
            data: { acceptedAt: new Date() }
        })

        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-amber-600">Ya Eres Miembro</h1>
                    <p className="text-muted-foreground">
                        Ya perteneces a la organización {invitation.organization.name}
                    </p>
                    <Link href="/" className="text-primary hover:underline">
                        Ir al Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    // Accept the invitation: create membership and mark as accepted
    await prisma.$transaction(async (tx) => {
        // Create membership
        await tx.userOrganization.create({
            data: {
                userId: sessionUser.userId,
                organizationId: invitation.organizationId,
                role: invitation.role
            }
        })

        // Mark invitation as accepted
        await tx.organizationInvitation.update({
            where: { id: invitation.id },
            data: { acceptedAt: new Date() }
        })
    })

    // Set this organization as current
    const cookieStore = await cookies()
    cookieStore.set('current-organization', invitation.organizationId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365 // 1 year
    })

    // Success page with auto-redirect
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4 max-w-md">
                <div className="text-6xl">🎉</div>
                <h1 className="text-3xl font-bold text-green-600">¡Bienvenido!</h1>
                <p className="text-lg">
                    Te has unido exitosamente a <strong>{invitation.organization.name}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                    Serás redirigido al dashboard en unos segundos...
                </p>
                <meta httpEquiv="refresh" content="3;url=/" />
            </div>
        </div>
    )
}
