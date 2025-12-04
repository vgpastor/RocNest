import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authService } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const user = await authService.getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const organizationId = user.currentOrganizationId
        if (!organizationId) {
            return NextResponse.json({ error: 'No hay organización seleccionada' }, { status: 400 })
        }

        // Check if user is admin
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: organizationId,
            },
        })

        if (!userOrg || userOrg.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const body = await request.json()
        const { itemId, priority, notes } = body

        // Verify item exists and belongs to organization
        const item = await prisma.item.findFirst({
            where: {
                id: itemId,
                organizationId,
                deletedAt: null,
            },
            include: {
                product: {
                    include: {
                        category: {
                            include: {
                                checklistTemplates: {
                                    where: {
                                        isActive: true,
                                    },
                                    orderBy: {
                                        createdAt: 'desc',
                                    },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!item) {
            return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
        }

        // Check if there's already a pending review for this item
        const existingReview = await prisma.itemReview.findFirst({
            where: {
                itemId,
                status: {
                    in: ['pending', 'in_progress'],
                },
            },
        })

        if (existingReview) {
            return NextResponse.json(
                { error: 'Ya existe una revisión pendiente para este item' },
                { status: 400 }
            )
        }

        // Create review
        const review = await prisma.itemReview.create({
            data: {
                itemId,
                reviewedBy: user.id,
                status: 'pending',
                priority: priority || 'normal',
                notes: notes || null,
            },
        })

        // Initialize check items from template if available
        const checklistTemplate = item.product.category?.checklistTemplates[0]
        if (checklistTemplate) {
            const templateItems = checklistTemplate.items as any[]

            if (templateItems && templateItems.length > 0) {
                await prisma.itemReviewCheckItem.createMany({
                    data: templateItems.map((templateItem: any) => ({
                        reviewId: review.id,
                        checkItemId: templateItem.id,
                        label: templateItem.label,
                        checked: false,
                        value: null,
                        notes: null,
                    })),
                })
            }
        }

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        console.error('Error creating review:', error)
        return NextResponse.json(
            { error: 'Error al crear la revisión' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await authService.getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const organizationId = user.currentOrganizationId
        if (!organizationId) {
            return NextResponse.json({ error: 'No hay organización seleccionada' }, { status: 400 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const priority = searchParams.get('priority')
        const categoryId = searchParams.get('category')

        const reviews = await prisma.itemReview.findMany({
            where: {
                item: {
                    organizationId,
                    deletedAt: null,
                    ...(categoryId && {
                        product: {
                            categoryId,
                        },
                    }),
                },
                ...(status && { status }),
                ...(priority && { priority }),
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
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' },
            ],
        })

        return NextResponse.json(reviews)
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json(
            { error: 'Error al obtener las revisiones' },
            { status: 500 }
        )
    }
}
