import { NextRequest, NextResponse } from 'next/server'
import { authService, AuthenticationError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreateItemUseCase } from '@/app/(app)/catalog/application/use-cases/CreateItemUseCase'
import { PrismaItemRepository } from '@/app/(app)/catalog/infrastructure/repositories/PrismaItemRepository'
import { PrismaCategoryRepository } from '@/app/(app)/catalog/infrastructure/repositories/PrismaCategoryRepository'
import { SupabaseStorageService } from '@/app/(app)/catalog/infrastructure/services/SupabaseStorageService'
import { MetadataValidatorService } from '@/app/(app)/catalog/infrastructure/services/MetadataValidatorService'
import { ItemStatus } from '@/app/(app)/catalog/domain/value-objects/ItemStatus'

export async function POST(request: NextRequest) {
    try {
        const user = await authService.requireAuth()

        // Check admin role
        // We check if user is admin in ANY organization or if this is a global admin check?
        // The original code checked 'profiles' table for role 'admin'.
        // We should check prisma.profile or prisma.userOrganization.
        // Assuming global admin role in Profile for now, or we need to know which org this item belongs to.
        // The form data has 'categoryId'. Categories belong to organizations.
        // We should probably check if user is admin of the organization the category belongs to.

        // But first, let's parse the form to get categoryId
        const formData = await request.formData()
        const categoryId = formData.get('categoryId') as string

        if (!categoryId) {
            return NextResponse.json({ success: false, error: 'Categoría requerida' }, { status: 400 })
        }

        // Get category to find organization
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { organizationId: true }
        })

        if (!category) {
            return NextResponse.json({ success: false, error: 'Categoría no encontrada' }, { status: 404 })
        }

        // Verify user is admin of that organization
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.userId,
                    organizationId: category.organizationId
                }
            }
        })

        if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
        }

        const name = formData.get('name') as string
        const brand = formData.get('brand') as string
        const model = formData.get('model') as string
        const status = formData.get('status') as ItemStatus
        const description = formData.get('description') as string
        const identifierBase = formData.get('identifierBase') as string
        const quantity = parseInt(formData.get('quantity') as string)
        const hasUniqueNumbering = formData.get('hasUniqueNumbering') === 'on'
        const metadataJson = formData.get('metadata') as string
        const imageFile = formData.get('image') as File | null

        let metadata = {}
        try {
            metadata = JSON.parse(metadataJson)
        } catch (e) {
            return NextResponse.json({ success: false, error: 'Metadata inválida' }, { status: 400 })
        }

        // Instantiate dependencies
        const itemRepository = new PrismaItemRepository()
        const categoryRepository = new PrismaCategoryRepository()
        const storageService = new SupabaseStorageService()
        const metadataValidator = new MetadataValidatorService(categoryRepository)

        const createItemUseCase = new CreateItemUseCase(
            itemRepository,
            categoryRepository,
            storageService,
            metadataValidator,
            async () => user.userId
        )

        const result = await createItemUseCase.execute({
            name,
            description,
            brand,
            model,
            categoryId,
            identifierBase,
            hasUniqueNumbering,
            quantity,
            status,
            metadata,
            imageFile: imageFile || undefined
        })

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 })
        }

        return NextResponse.json({ success: true, items: result.items })
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
