import { prisma } from '@/lib/prisma'
import { Transformation } from '../../domain/entities/Transformation'
import { ITransformationRepository } from '../../application/use-cases/SubdivideItemUseCase'

export class PrismaTransformationRepository implements ITransformationRepository {
    async create(transformation: Omit<Transformation, 'id' | 'createdAt'>): Promise<Transformation> {
        const created = await prisma.transformation.create({
            data: {
                organizationId: transformation.organizationId,
                type: transformation.type,
                performedBy: transformation.performedBy,
                performedAt: transformation.performedAt,
                reason: transformation.reason,
                notes: transformation.notes,
                metadata: transformation.metadata as any
            }
        })

        return this.mapToEntity(created)
    }



    async addSourceItem(transformationId: string, itemId: string, quantity: number, notes?: string): Promise<void> {
        await prisma.transformationItem.create({
            data: {
                transformationId,
                itemId,
                quantity,
                notes,
                role: 'source'
            }
        })
    }

    async addResultItem(transformationId: string, itemId: string, quantity: number, notes?: string): Promise<void> {
        await prisma.transformationItem.create({
            data: {
                transformationId,
                itemId,
                quantity,
                notes,
                role: 'result'
            }
        })
    }

    async findById(id: string): Promise<Transformation | null> {
        const transformation = await prisma.transformation.findUnique({
            where: { id }
        })
        return transformation ? this.mapToEntity(transformation) : null
    }

    async findByItemId(itemId: string): Promise<Transformation[]> {
        const transformationItems = await prisma.transformationItem.findMany({
            where: { itemId },
            select: { transformationId: true }
        })

        const transformationIds = transformationItems.map(ti => ti.transformationId)

        if (transformationIds.length === 0) return []

        const transformations = await prisma.transformation.findMany({
            where: { id: { in: transformationIds } },
            orderBy: { performedAt: 'desc' }
        })

        return transformations.map(t => this.mapToEntity(t))
    }

    private mapToEntity(data: any): Transformation {
        return {
            id: data.id,
            organizationId: data.organizationId,
            type: data.type as any,
            performedBy: data.performedBy,
            performedAt: data.performedAt,
            reason: data.reason,
            notes: data.notes,
            metadata: data.metadata || {},
            createdAt: data.createdAt
        }
    }
}
