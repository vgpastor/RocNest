// API Route: PATCH/DELETE /api/organizations/[orgId]/members/[userId]
// Update member role or remove member
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// PATCH - Update member role
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const { orgId, userId } = await params
        const body = await request.json()
        const { role } = body

        if (!role || !['member', 'admin'].includes(role)) {
            return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
        }

        // Verify requesting user is admin
        const requesterMembership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.id,
                    organizationId: orgId
                }
            }
        })

        if (!requesterMembership || requesterMembership.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        // Get target user's current membership
        const targetMembership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: orgId
                }
            }
        })

        if (!targetMembership) {
            return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 })
        }

        // If downgrading from admin, verify there's another admin
        if (targetMembership.role === 'admin' && role !== 'admin') {
            const adminCount = await prisma.userOrganization.count({
                where: {
                    organizationId: orgId,
                    role: 'admin'
                }
            })

            if (adminCount <= 1) {
                return NextResponse.json(
                    { error: 'No se puede degradar el único admin de la organización' },
                    { status: 400 }
                )
            }
        }

        // Update role
        const updatedMembership = await prisma.userOrganization.update({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: orgId
                }
            },
            data: {
                role
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true
                    }
                }
            }
        })

        return NextResponse.json({ member: updatedMembership })
    } catch (error) {
        console.error('Error updating member role:', error)
        return NextResponse.json(
            { error: 'Error al actualizar rol' },
            { status: 500 }
        )
    }
}

// DELETE - Remove member from organization
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const { orgId, userId } = await params

        // Verify requesting user is admin
        const requesterMembership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.id,
                    organizationId: orgId
                }
            }
        })

        if (!requesterMembership || requesterMembership.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        // Get target user's membership
        const targetMembership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: orgId
                }
            }
        })

        if (!targetMembership) {
            return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 })
        }

        // If removing admin, verify there's another admin
        if (targetMembership.role === 'admin') {
            const adminCount = await prisma.userOrganization.count({
                where: {
                    organizationId: orgId,
                    role: 'admin'
                }
            })

            if (adminCount <= 1) {
                return NextResponse.json(
                    { error: 'No se puede remover el único admin de la organización' },
                    { status: 400 }
                )
            }
        }

        // Delete membership
        await prisma.userOrganization.delete({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: orgId
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error removing member:', error)
        return NextResponse.json(
            { error: 'Error al remover miembro' },
            { status: 500 }
        )
    }
}
