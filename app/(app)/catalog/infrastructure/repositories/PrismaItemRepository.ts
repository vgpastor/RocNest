import { prisma } from '@/lib/prisma'

import { IItemRepository } from '../../application/use-cases/CreateItemUseCase'
import { Item } from '../../domain/entities/Item'
import { ItemStatus } from '../../domain/value-objects/ItemStatus'

export class PrismaItemRepository implements IItemRepository {
    async create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
        // We need organizationId to create an item.
        // Since Item entity doesn't have it, we fetch it from the category.
        const category = await prisma.category.findUnique({
            where: { id: item.categoryId },
            select: { organizationId: true }
        })

        if (!category) {
            throw new Error('Category not found')
        }

        // Create Product first
        const product = await prisma.product.create({
            data: {
                organizationId: category.organizationId,
                categoryId: item.categoryId,
                name: item.name,
                description: item.description,
                brand: item.brand,
                model: item.model,
                imageUrl: item.imageUrl,
                metadata: item.metadata || {},
            }
        })

        // Create Item
        const created = await prisma.item.create({
            data: {
                organizationId: category.organizationId,
                productId: product.id,
                status: item.status.toString(),
                identifier: item.identifier,
                hasUniqueNumbering: item.hasUniqueNumbering,
                isComposite: item.isComposite,
                metadata: item.metadata || {},
                originTransformationId: item.originTransformationId,
                deletedAt: item.deletedAt,
                deletionReason: item.deletionReason
            },
            include: { product: true }
        })

        return this.mapToEntity(created)
    }

    async findById(id: string): Promise<Item | null> {
        const item = await prisma.item.findUnique({
            where: { id },
            include: { product: true }
        })

        if (!item || item.deletedAt) return null

        return this.mapToEntity(item)
    }

    async findByIdentifier(identifier: string): Promise<Item | null> {
        const item = await prisma.item.findUnique({
            where: { identifier },
            include: { product: true }
        })

        if (!item || item.deletedAt) return null

        return this.mapToEntity(item)
    }

    async update(id: string, updates: Partial<Item>): Promise<Item> {
        // Update Item fields
        const itemUpdateData: any = {}
        if (updates.status !== undefined) itemUpdateData.status = updates.status.toString()
        if (updates.metadata !== undefined) itemUpdateData.metadata = updates.metadata
        if (updates.isComposite !== undefined) itemUpdateData.isComposite = updates.isComposite
        if (updates.deletedAt !== undefined) itemUpdateData.deletedAt = updates.deletedAt
        if (updates.deletionReason !== undefined) itemUpdateData.deletionReason = updates.deletionReason
        if (updates.identifier !== undefined) itemUpdateData.identifier = updates.identifier

        // We might need to update Product fields too if they are passed, 
        // but for now let's focus on Item fields or assume Product updates happen via ProductRepository.
        // If we need to update product fields (name, brand, etc), we'd need to fetch the item first to get productId.

        const updated = await prisma.item.update({
            where: { id },
            data: itemUpdateData,
            include: { product: true }
        })

        return this.mapToEntity(updated)
    }

    private mapToEntity(data: any): Item {
        // If product is joined, use its fields. Fallback to data fields if they exist (legacy/transition)
        const product = data.product || {}

        // Convert string status from DB to ItemStatus Value Object
        const statusResult = ItemStatus.create(data.status)
        if (statusResult.isLeft) {
            throw new Error(`Invalid item status: ${data.status}`)
        }

        return {
            id: data.id,
            organizationId: data.organizationId,
            name: product.name || data.name || '',
            description: product.description || data.description || null,
            brand: product.brand || data.brand || '',
            model: product.model || data.model || '',
            categoryId: product.categoryId || data.categoryId || '',
            status: statusResult.value,
            imageUrl: product.imageUrl || data.imageUrl || null,
            identifier: data.identifier || '',
            hasUniqueNumbering: data.hasUniqueNumbering,
            isComposite: data.isComposite,
            metadata: data.metadata || {},
            originTransformationId: data.originTransformationId,
            deletedAt: data.deletedAt,
            deletionReason: data.deletionReason,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
    async delete(id: string): Promise<void> {
        await prisma.item.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletionReason: 'Soft deleted by user'
            }
        })
    }
}
