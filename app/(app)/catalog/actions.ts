'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { CreateItemUseCase } from './application/use-cases/CreateItemUseCase'
import { PrismaItemRepository } from './infrastructure/repositories/PrismaItemRepository'
import { PrismaCategoryRepository } from './infrastructure/repositories/PrismaCategoryRepository'
import { SupabaseStorageService } from './infrastructure/services/SupabaseStorageService'
import { MetadataValidatorService } from './infrastructure/services/MetadataValidatorService'
import { AuthService } from '@/lib/auth/services/AuthService'
import { ItemStatus } from './domain/value-objects/ItemStatus'

export async function getItemsForProduct(productId: string) {
    try {
        const items = await prisma.item.findMany({
            where: {
                productId,
                deletedAt: null
            },
            orderBy: {
                identifier: 'asc'
            }
        })
        return { success: true, data: items }
    } catch (error) {
        console.error('Error fetching items for product:', error)
        return { success: false, error: 'Failed to fetch items' }
    }
}

export async function createItem(formData: FormData) {
    try {
        const authService = new AuthService()
        const categoryRepository = new PrismaCategoryRepository()
        const itemRepository = new PrismaItemRepository()
        const storageService = new SupabaseStorageService()
        const metadataValidator = new MetadataValidatorService(categoryRepository)

        const useCase = new CreateItemUseCase(
            itemRepository,
            categoryRepository,
            storageService,
            metadataValidator,
            async () => (await authService.getCurrentUser())?.userId || ''
        )

        const metadataStr = formData.get('metadata') as string
        const metadata = metadataStr ? JSON.parse(metadataStr) : {}

        // We use hasUniqueNumbering: false to preserve the exact identifier entered by the user
        // since the form is for creating a single item with a specific identifier.
        const result = await useCase.execute({
            name: formData.get('name') as string,
            description: '',
            brand: formData.get('brand') as string,
            model: formData.get('model') as string,
            identifierBase: formData.get('identifier') as string,
            categoryId: formData.get('category') as string,
            quantity: 1,
            hasUniqueNumbering: false,
            status: formData.get('status') as ItemStatus,
            metadata: metadata,
            imageFile: formData.get('image') as File | undefined
        })

        if (result.success) {
            revalidatePath('/catalog')
            return { success: true, items: result.items }
        } else {
            return { success: false, error: result.error }
        }
    } catch (error) {
        console.error('Error in createItem action:', error)
        return { success: false, error: 'Error interno del servidor' }
    }
}

export async function deleteItem(id: string) {
    try {
        const itemRepository = new PrismaItemRepository()
        await itemRepository.delete(id)
        revalidatePath('/catalog')
        return { success: true }
    } catch (error) {
        console.error('Error deleting item:', error)
        return { success: false, error: 'Error al eliminar el item' }
    }
}

export async function deleteProduct(id: string) {
    try {
        // Soft delete product
        await prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() }
        })
        revalidatePath('/catalog')
        return { success: true }
    } catch (error) {
        console.error('Error deleting product:', error)
        return { success: false, error: 'Error al eliminar el producto' }
    }
}
