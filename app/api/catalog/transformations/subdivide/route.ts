import { NextRequest, NextResponse } from 'next/server'

import { SubdivideItemUseCase } from '@/app/(app)/catalog/application/use-cases/SubdivideItemUseCase'
import { PrismaCategoryRepository } from '@/app/(app)/catalog/infrastructure/repositories/PrismaCategoryRepository'
import { PrismaItemRepository } from '@/app/(app)/catalog/infrastructure/repositories/PrismaItemRepository'
import { PrismaTransformationRepository } from '@/app/(app)/catalog/infrastructure/repositories/PrismaTransformationRepository'
import { authService, AuthenticationError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const user = await authService.requireAuth()

        // Check admin role
        // We need to find the organization of the item being subdivided
        const body = await request.json()
        const { sourceItemId } = body

        if (!sourceItemId) {
            return NextResponse.json({ success: false, error: 'Item origen requerido' }, { status: 400 })
        }

        const sourceItem = await prisma.item.findUnique({
            where: { id: sourceItemId },
            select: { organizationId: true }
        })

        if (!sourceItem) {
            return NextResponse.json({ success: false, error: 'Item no encontrado' }, { status: 404 })
        }

        // Verify user is admin of that organization
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.userId,
                    organizationId: sourceItem.organizationId
                }
            }
        })

        if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
        }

        // Instantiate dependencies
        const itemRepository = new PrismaItemRepository()
        const categoryRepository = new PrismaCategoryRepository()
        const transformationRepository = new PrismaTransformationRepository()

        const subdivideItemUseCase = new SubdivideItemUseCase(
            itemRepository,
            categoryRepository,
            transformationRepository,
            async () => user.userId
        )

        const result = await subdivideItemUseCase.execute({
            sourceItemId: body.sourceItemId,
            subdivisions: body.subdivisions,
            unit: body.unit,
            reason: body.reason,
            notes: body.notes
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
