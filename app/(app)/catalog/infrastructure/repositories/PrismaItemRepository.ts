import { prisma } from '@/lib/prisma'
import { Item } from '../../domain/entities/Item'
import { IItemRepository } from '../../application/use-cases/CreateItemUseCase'

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

        const created = await prisma.item.create({
            data: {
                name: item.name,
                description: item.description,
                brand: item.brand,
                model: item.model,
                categoryId: item.categoryId,
                organizationId: category.organizationId,
                status: item.status,
                imageUrl: item.imageUrl,
                identifier: item.identifier,
                hasUniqueNumbering: item.hasUniqueNumbering,
                isComposite: item.isComposite,
                metadata: item.metadata as any,
                originTransformationId: item.originTransformationId,
                deletedAt: item.deletedAt,
                deletionReason: item.deletionReason
            }
        })

        return this.mapToEntity(created)
    }

    async findById(id: string): Promise<Item | null> {
        const item = await prisma.item.findUnique({
            where: { id }
        })

        return item ? this.mapToEntity(item) : null
    }

    async findByIdentifier(identifier: string): Promise<Item | null> {
        const item = await prisma.item.findUnique({
            where: { identifier }
        })

        return item ? this.mapToEntity(item) : null
    }

    async update(id: string, updates: Partial<Item>): Promise<Item> {
        const updateData: any = {}
        if (updates.name !== undefined) updateData.name = updates.name
        if (updates.description !== undefined) updateData.description = updates.description
        if (updates.status !== undefined) updateData.status = updates.status
        if (updates.metadata !== undefined) updateData.metadata = updates.metadata
        if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl
        if (updates.isComposite !== undefined) updateData.isComposite = updates.isComposite
        if (updates.deletedAt !== undefined) updateData.deletedAt = updates.deletedAt
        if (updates.deletionReason !== undefined) updateData.deletionReason = updates.deletionReason

        const updated = await prisma.item.update({
            where: { id },
            data: updateData
        })

        return this.mapToEntity(updated)
    }

    private mapToEntity(data: any): Item {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            brand: data.brand || '', // Handle nulls if entity requires string
            model: data.model || '',
            categoryId: data.categoryId || '',
            status: data.status as any,
            imageUrl: data.imageUrl,
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
}
