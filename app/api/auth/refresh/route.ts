import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { createSession, setSessionCookie } from '@/lib/auth/session'

/**
 * POST /api/auth/refresh
 * Refreshes the JWT token with updated organization data
 * Used after creating/joining a new organization
 */
export async function POST() {
    try {
        const sessionUser = await getSessionUser()

        if (!sessionUser) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        // Fetch user with updated organizations
        const user = await prisma.profile.findUnique({
            where: { id: sessionUser.userId },
            include: {
                userOrganizations: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        // Create new session with updated organization IDs
        const organizationIds = user.userOrganizations.map(uo => uo.organization.id)
        const token = await createSession(user.id, user.email, organizationIds)

        // Prepare response
        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                organizations: user.userOrganizations,
            },
        })

        // Set new session cookie
        setSessionCookie(response, token)

        return response
    } catch (error) {
        console.error('Token refresh error:', error)
        return NextResponse.json(
            { error: 'Error al refrescar el token' },
            { status: 500 }
        )
    }
}
