import { prisma } from '@/lib/prisma'
import { Category } from '../../domain/entities/Category'
import { ICategoryRepository } from '../../application/use-cases/CreateItemUseCase'

export class PrismaCategoryRepository implements ICategoryRepository {
    async findById(id: string): Promise<Category | null> {
        const category = await prisma.category.findUnique({
            where: { id }
        })

        if (!category) return null

        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            icon: category.icon,
            requiresUniqueNumbering: category.requiresUniqueNumbering,
            canBeComposite: category.canBeComposite,
            canBeSubdivided: category.canBeSubdivided,
            metadataSchema: category.metadataSchema as any,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        }
    }
}
