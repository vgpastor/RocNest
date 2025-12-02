// API Route: GET /api/organizations/[orgId]/members
// Get all members of an organization
import { NextResponse } from 'next/server'
import { authService, AuthenticationError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ orgId: string }> }
) {
    try {
        const user = await authService.requireAuth()
        const { orgId } = await params

        // Verify user is admin of this organization
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.userId,
                    organizationId: orgId
                }
            }
        })

        if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        // Get all members
        const members = await prisma.userOrganization.findMany({
            where: {
                organizationId: orgId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true
                    }
                }
            },
            orderBy: {
                joinedAt: 'desc'
            }
        })

        return NextResponse.json({ members })
    } catch (error) {
        if (error instanceof AuthenticationError) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        console.error('Error fetching members:', error)
        return NextResponse.json(
            { error: 'Error al obtener miembros' },
            { status: 500 }
        )
    }
}

// API Route: POST /api/organizations/[orgId]/members
// Invite a new member to the organization
export async function POST(
    request: Request,
    { params }: { params: Promise<{ orgId: string }> }
) {
    try {
        const user = await authService.requireAuth()
        const { orgId } = await params
        const body = await request.json()
        const { email, role = 'member' } = body

        if (!email) {
            return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
        }

        if (!['member', 'admin'].includes(role)) {
            return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
        }

        // Verify user is admin
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.userId,
                    organizationId: orgId
                }
            }
        })

        if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        // Create invitation
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiration

        const invitation = await prisma.organizationInvitation.create({
            data: {
                organizationId: orgId,
                email,
                role,
                invitedBy: user.userId,
                expiresAt
            },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        // Build invitation link using current request URL
        const protocol = request.headers.get('x-forwarded-proto') || 'http'
        const host = request.headers.get('host') || 'localhost:3000'
        const invitationLink = `${protocol}://${host}/invitations/accept?token=${invitation.token}`

        // TODO: Send email with invitation link
        return NextResponse.json({
            invitation,
            invitationLink
        }, { status: 201 })
    } catch (error: any) {
        if (error instanceof AuthenticationError) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        console.error('Error creating invitation:', error)

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Ya existe una invitación pendiente para este email' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: 'Error al crear invitación' },
            { status: 500 }
        )
    }
}
