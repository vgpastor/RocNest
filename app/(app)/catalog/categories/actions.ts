'use server'

import { revalidatePath } from 'next/cache'

import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

import { PrismaCategoryRepository } from '../infrastructure/repositories/PrismaCategoryRepository'

const categoryRepository = new PrismaCategoryRepository()

export async function createCategory(formData: FormData) {
    const sessionUser = await getSessionUser()
    const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId)

    if (!organizationId) {
        return { success: false, error: 'Organización no encontrada' }
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const icon = formData.get('icon') as string
    const requiresUniqueNumbering = formData.get('requiresUniqueNumbering') === 'on'
    const canBeComposite = formData.get('canBeComposite') === 'on'
    const canBeSubdivided = formData.get('canBeSubdivided') === 'on'

    try {
        await categoryRepository.create({
            name,
            description,
            icon,
            requiresUniqueNumbering,
            canBeComposite,
            canBeSubdivided,
            metadataSchema: { type: 'object', properties: {} }, // TODO: Implement metadata schema editor
            organizationId
        })

        revalidatePath('/catalog/categories')
        return { success: true }
    } catch (error) {
        console.error('Error creating category:', error)
        return { success: false, error: 'Error al crear la categoría' }
    }
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const icon = formData.get('icon') as string
    const requiresUniqueNumbering = formData.get('requiresUniqueNumbering') === 'on'
    const canBeComposite = formData.get('canBeComposite') === 'on'
    const canBeSubdivided = formData.get('canBeSubdivided') === 'on'

    try {
        await categoryRepository.update(id, {
            name,
            description,
            icon,
            requiresUniqueNumbering,
            canBeComposite,
            canBeSubdivided
        })

        revalidatePath('/catalog/categories')
        return { success: true }
    } catch (error) {
        console.error('Error updating category:', error)
        return { success: false, error: 'Error al actualizar la categoría' }
    }
}

export async function deleteCategory(id: string) {
    try {
        // Use a transaction to ensure data integrity
        await prisma.$transaction(async (tx) => {
            // 1. Unlink products (set categoryId to null)
            // Using executeRawUnsafe because updateMany was throwing a validation error claiming categoryId doesn't exist
            await tx.$executeRawUnsafe(
                'UPDATE products SET category_id = NULL WHERE category_id = $1::uuid',
                id
            )

            // 2. Soft Delete the category (preserve history)
            await tx.category.update({
                where: { id },
                data: { deletedAt: new Date() }
            })
        })

        revalidatePath('/catalog/categories')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting category:', error)

        // Check for specific Prisma errors
        if (error.code === 'P2003') {
            // Foreign key constraint failed
            // Likely due to ReservationItem (onDelete: Restrict)
            return {
                success: false,
                error: 'No se puede eliminar la categoría porque está asociada a reservas o historial existente.'
            }
        }

        return { success: false, error: 'Error al eliminar la categoría' }
    }
}

export async function getCategoryProducts(categoryId: string) {
    const sessionUser = await getSessionUser()
    const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId)

    if (!organizationId) return []

    // We need to import prisma here or use a repository. 
    // Since we don't have a ProductRepository in this context yet, let's use prisma directly for this check
    // or better, let's keep it clean and use the PrismaCategoryRepository if we extend it, 
    // but for now direct prisma call is faster for this specific UI requirement.
    // Actually, let's stick to the pattern and assume we might need a ProductRepository later, 
    // but for now let's just use prisma to avoid over-engineering for a simple check.
    const { prisma } = await import('@/lib/prisma')

    const products = await prisma.product.findMany({
        where: {
            organizationId,
            categoryId
        },
        select: {
            id: true,
            name: true
        }
    })

    return products
}
