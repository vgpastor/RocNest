import { NextRequest, NextResponse } from 'next/server'
import { authService, AuthenticationError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DeteriorateItemUseCase } from '@/app/(app)/catalog/application/use-cases/DeteriorateItemUseCase'
import { PrismaItemRepository } from '@/app/(app)/catalog/infrastructure/repositories/PrismaItemRepository'
import { PrismaTransformationRepository } from '@/app/(app)/catalog/infrastructure/repositories/PrismaTransformationRepository'

export async function POST(request: NextRequest) {
    try {
        const user = await authService.requireAuth()

        const body = await request.json()
        const { itemId } = body

        if (!itemId) {
            return NextResponse.json({ success: false, error: 'Item requerido' }, { status: 400 })
        }

        const item = await prisma.item.findUnique({
            where: { id: itemId },
            select: { organizationId: true }
        })

        if (!item) {
            return NextResponse.json({ success: false, error: 'Item no encontrado' }, { status: 404 })
        }

        // Verify user is admin of that organization
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.userId,
                    organizationId: item.organizationId
                }
            }
        })

        if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
        }

        // Instantiate dependencies
        const itemRepository = new PrismaItemRepository()
        const transformationRepository = new PrismaTransformationRepository()

        const deteriorateItemUseCase = new DeteriorateItemUseCase(
            itemRepository,
            transformationRepository,
            async () => user.userId
        )

        const result = await deteriorateItemUseCase.execute({
            itemId: body.itemId,
            originalValue: body.originalValue,
            damagedValue: body.damagedValue,
            remainingValue: body.remainingValue,
            damageLocation: body.damageLocation,
            damageReason: body.damageReason,
            unit: body.unit,
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
