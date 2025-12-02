'use server'

import { getSessionUser } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { CreateItemUseCase } from '@/app/catalog/application/use-cases/CreateItemUseCase'
import { PrismaItemRepository } from '@/app/catalog/infrastructure/repositories/PrismaItemRepository'
import { PrismaCategoryRepository } from '@/app/catalog/infrastructure/repositories/PrismaCategoryRepository'
import { SupabaseStorageService } from '@/app/catalog/infrastructure/services/SupabaseStorageService'
import { MetadataValidatorService } from '@/app/catalog/infrastructure/services/MetadataValidatorService'
import { ItemStatus } from '@/app/catalog/domain/value-objects/ItemStatus'
import { prisma } from '@/lib/prisma'

export async function createItem(formData: FormData) {
    // Check if user is authenticated
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
        return { success: false, error: 'No autenticado' }
    }

    // Extract form data
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const categoryId = formData.get('category') as string // Note: form field name is 'category' but it's ID
    const identifierBase = formData.get('identifier') as string
    const status = (formData.get('status') as ItemStatus) || ItemStatus.AVAILABLE
    const imageFile = formData.get('image') as File | null

    // Default values for fields not in simple form
    const quantity = 1
    const hasUniqueNumbering = true
    const metadata = {}

    // Validate required fields
    if (!name || !brand || !model || !categoryId || !identifierBase) {
        return { success: false, error: 'Faltan campos requeridos' }
    }

    // Check authorization (admin of organization)
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { organizationId: true }
    })

    if (!category) {
        return { success: false, error: 'Categoría no encontrada' }
    }

    const membership = await prisma.userOrganization.findUnique({
        where: {
            userId_organizationId: {
                userId: sessionUser.userId,
                organizationId: category.organizationId
            }
        }
    })

    if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
        return { success: false, error: 'No tienes permisos para crear items en esta organización' }
    }

    try {
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
            async () => sessionUser.userId
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
            return { success: false, error: result.error }
        }

        // Revalidate the catalog page to show the new item
        revalidatePath('/catalog')

        return { success: true, data: result.items[0] }
    } catch (error) {
        console.error('Error creating item:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Error al crear el item' }
    }
}
