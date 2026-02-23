import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { Category, CategoryMetadataSchema } from '../../domain/entities/Category'
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository'

export class PrismaCategoryRepository implements ICategoryRepository {
    async findAll(organizationId: string): Promise<Category[]> {
        const categories = await prisma.category.findMany({
            where: {
                organizationId,
                deletedAt: null
            },
            orderBy: { name: 'asc' }
        })

        return categories.map(this.mapToEntity)
    }

    async findById(id: string): Promise<Category | null> {
        const category = await prisma.category.findUnique({
            where: { id }
        })

        if (!category || category.deletedAt) return null

        return this.mapToEntity(category)
    }

    async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
        const created = await prisma.category.create({
            data: {
                name: category.name,
                description: category.description,
                icon: category.icon,
                requiresUniqueNumbering: category.requiresUniqueNumbering,
                canBeComposite: category.canBeComposite,
                canBeSubdivided: category.canBeSubdivided,
                metadataSchema: category.metadataSchema as unknown as Prisma.InputJsonValue,
                organizationId: category.organizationId
            }
        })

        return this.mapToEntity(created)
    }

    async update(id: string, category: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> {
        const updated = await prisma.category.update({
            where: { id },
            data: {
                ...category,
                metadataSchema: category.metadataSchema as unknown as Prisma.InputJsonValue
            }
        })

        return this.mapToEntity(updated)
    }

    async delete(id: string): Promise<void> {
        await prisma.category.update({
            where: { id },
            data: { deletedAt: new Date() }
        })
    }

    private mapToEntity(prismaCategory: {
        id: string
        organizationId: string
        name: string
        description: string | null
        icon: string | null
        requiresUniqueNumbering: boolean
        canBeComposite: boolean
        canBeSubdivided: boolean
        metadataSchema: Prisma.JsonValue
        createdAt: Date
        updatedAt: Date
    }): Category {
        return {
            id: prismaCategory.id,
            organizationId: prismaCategory.organizationId,
            name: prismaCategory.name,
            description: prismaCategory.description,
            icon: prismaCategory.icon,
            requiresUniqueNumbering: prismaCategory.requiresUniqueNumbering,
            canBeComposite: prismaCategory.canBeComposite,
            canBeSubdivided: prismaCategory.canBeSubdivided,
            metadataSchema: prismaCategory.metadataSchema as unknown as CategoryMetadataSchema,
            createdAt: prismaCategory.createdAt,
            updatedAt: prismaCategory.updatedAt
        }
    }
}
