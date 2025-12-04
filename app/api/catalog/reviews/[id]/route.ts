import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authService } from '@/lib/auth'
import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authService.getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const organizationId = await OrganizationContextService.getCurrentOrganizationId(user.userId)
        if (!organizationId) {
            return NextResponse.json({ error: 'No hay organización seleccionada' }, { status: 400 })
        }

        // Check if user is admin
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.userId,
                organizationId: organizationId,
            },
        })

        if (!userOrg || userOrg.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json()
        const { status, priority, notes, rejectionReason, checkItems } = body

        // Verify review exists and belongs to organization
        const existingReview = await prisma.itemReview.findFirst({
            where: {
                id,
                item: {
                    organizationId,
                },
            },
        })

        if (!existingReview) {
            return NextResponse.json({ error: 'Revisión no encontrada' }, { status: 404 })
        }

        // Update review
        const updatedReview = await prisma.itemReview.update({
            where: { id },
            data: {
                status,
                priority,
                notes,
                rejectionReason: status === 'rejected' ? rejectionReason : null,
                reviewedAt: status === 'approved' || status === 'rejected' ? new Date() : null,
                reviewedBy: user.userId,
            },
        })

        // Update check items
        if (checkItems && Array.isArray(checkItems)) {
            // Delete existing check items
            await prisma.itemReviewCheckItem.deleteMany({
                where: { reviewId: id },
            })

            // Create new check items
            await prisma.itemReviewCheckItem.createMany({
                data: checkItems.map((item: any) => ({
                    reviewId: id,
                    checkItemId: item.checkItemId,
                    label: item.label || '',
                    checked: item.checked || false,
                    value: item.value || null,
                    notes: item.notes || null,
                })),
            })
        }

        return NextResponse.json(updatedReview)
    } catch (error) {
        console.error('Error updating review:', error)
        return NextResponse.json(
            { error: 'Error al actualizar la revisión' },
            { status: 500 }
        )
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authService.getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const organizationId = await OrganizationContextService.getCurrentOrganizationId(user.userId)
        if (!organizationId) {
            return NextResponse.json({ error: 'No hay organización seleccionada' }, { status: 400 })
        }

        const { id } = await params

        const review = await prisma.itemReview.findFirst({
            where: {
                id,
                item: {
                    organizationId,
                },
            },
            include: {
                item: {
                    include: {
                        product: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                reviewer: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                checkItems: true,
            },
        })

        if (!review) {
            return NextResponse.json({ error: 'Revisión no encontrada' }, { status: 404 })
        }

        return NextResponse.json(review)
    } catch (error) {
        console.error('Error fetching review:', error)
        return NextResponse.json(
            { error: 'Error al obtener la revisión' },
            { status: 500 }
        )
    }
}
