import { NextRequest, NextResponse } from 'next/server'
import { authService, AuthenticationError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DonateItemsUseCase } from '@/app/(app)/catalog/application/use-cases/DonateItemsUseCase'
import { PrismaItemRepository } from '@/app/(app)/catalog/infrastructure/repositories/PrismaItemRepository'
import { PrismaTransformationRepository } from '@/app/(app)/catalog/infrastructure/repositories/PrismaTransformationRepository'

export async function POST(request: NextRequest) {
    try {
        const user = await authService.requireAuth()

        const body = await request.json()
        const { itemIds } = body

        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return NextResponse.json({ success: false, error: 'Items requeridos' }, { status: 400 })
        }

        // Verify user is admin of all items' organizations
        const items = await prisma.item.findMany({
            where: { id: { in: itemIds } },
            select: { id: true, organizationId: true }
        })

        if (items.length !== itemIds.length) {
            return NextResponse.json({ success: false, error: 'Algunos items no fueron encontrados' }, { status: 404 })
        }

        // Check unique organizations
        const orgIds = [...new Set(items.map((i: { organizationId: string }) => i.organizationId))]

        // Verify admin role for each organization
        for (const orgId of orgIds) {
            const membership = await prisma.userOrganization.findUnique({
                where: {
                    userId_organizationId: {
                        userId: user.userId,
                        organizationId: orgId
                    }
                }
            })

            if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
                return NextResponse.json({ success: false, error: 'No autorizado para una o más organizaciones' }, { status: 403 })
            }
        }

        // Instantiate dependencies
        const itemRepository = new PrismaItemRepository()
        const transformationRepository = new PrismaTransformationRepository()

        const donateItemsUseCase = new DonateItemsUseCase(
            itemRepository,
            transformationRepository,
            async () => user.userId
        )

        const result = await donateItemsUseCase.execute({
            itemIds: body.itemIds,
            location: body.location,
            recipients: body.recipients,
            reason: body.reason,
            notes: body.notes,
            recoverable: body.recoverable
        })

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 })
        }

        return NextResponse.json({ success: true, transformation: result.transformation })
    } catch (error) {
        if (error instanceof AuthenticationError) {
            return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 })
        }
        console.error('Error in API route:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
