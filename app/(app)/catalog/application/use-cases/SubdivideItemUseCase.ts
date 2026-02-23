// Application Layer - Use Case
// Subdivide Item Use Case

import { Transformation, SubdivisionMetadata } from '../../domain/entities/Transformation'
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository'
import { ItemStatus } from '../../domain/value-objects/ItemStatus'
import { TransformationType } from '../../domain/value-objects/TransformationType'
import { SubdivideItemInput, SubdivideItemOutput } from '../dtos/TransformationDTOs'

import { IItemRepository } from './CreateItemUseCase'


export interface ITransformationRepository {
    create(transformation: Omit<Transformation, 'id' | 'createdAt'>): Promise<Transformation>
    addSourceItem(transformationId: string, itemId: string, quantity: number, notes?: string): Promise<void>
    addResultItem(transformationId: string, itemId: string, quantity: number, notes?: string): Promise<void>
}

export class SubdivideItemUseCase {
    constructor(
        private itemRepository: IItemRepository,
        private categoryRepository: ICategoryRepository,
        private transformationRepository: ITransformationRepository,
        private getCurrentUserId: () => Promise<string>
    ) { }

    async execute(input: SubdivideItemInput): Promise<SubdivideItemOutput> {
        try {
            // 1. Validate source item exists
            const sourceItem = await this.itemRepository.findById(input.sourceItemId)
            if (!sourceItem) {
                return { success: false, error: 'Item no encontrado' }
            }

            // 2. Validate item can be subdivided
            if (!sourceItem.status.isAvailable()) {
                return {
                    success: false,
                    error: `No se puede subdividir un item con estado "${sourceItem.status.getLabel()}"`
                }
            }

            // 3. Validate category allows subdivision
            const category = await this.categoryRepository.findById(sourceItem.categoryId)
            if (!category) {
                return { success: false, error: 'Categoría no encontrada' }
            }

            if (!category.canBeSubdivided) {
                return {
                    success: false,
                    error: `La categoría "${category.name}" no permite subdivisión`
                }
            }

            // 4. Validate subdivisions
            if (input.subdivisions.length < 2) {
                return {
                    success: false,
                    error: 'Debe haber al menos 2 subdivisiones'
                }
            }

            // 5. Get current user
            const userId = await this.getCurrentUserId()

            // 6. Create transformation
            const metadata: SubdivisionMetadata = {
                originalLength: input.subdivisions.reduce((sum, sub) => sum + sub.value, 0),
                subdivisions: input.subdivisions,
                unit: input.unit
            }

            const transformation = await this.transformationRepository.create({
                organizationId: sourceItem.organizationId,
                type: TransformationType.SUBDIVISION,
                performedBy: userId,
                performedAt: new Date(),
                reason: input.reason,
                notes: input.notes || null,
                metadata
            })

            // 7. Add source item to transformation
            await this.transformationRepository.addSourceItem(
                transformation.id,
                sourceItem.id,
                1
            )

            // 8. Update source item status to SUBDIVIDED
            await this.itemRepository.update(sourceItem.id, {
                status: ItemStatus.subdivided()
            })

            // 9. Create result items
            const resultItems: Array<{ id: string; identifier: string; name: string }> = []

            for (const subdivision of input.subdivisions) {
                // Check if identifier exists
                const existing = await this.itemRepository.findByIdentifier(subdivision.identifier)
                if (existing) {
                    return {
                        success: false,
                        error: `El código identificador ${subdivision.identifier} ya existe`
                    }
                }

                // Create new item with updated metadata
                const newMetadata = { ...sourceItem.metadata }

                // Update the value field (could be length, weight, etc.)
                // This is generic - the specific field depends on the category
                const valueField = this.getValueFieldFromMetadata(sourceItem.metadata, input.unit)
                if (valueField) {
                    newMetadata[valueField] = subdivision.value
                }

                const newItem = await this.itemRepository.create({
                    name: sourceItem.name,
                    description: sourceItem.description,
                    brand: sourceItem.brand,
                    model: sourceItem.model,
                    categoryId: sourceItem.categoryId,
                    organizationId: sourceItem.organizationId,
                    status: ItemStatus.available(),
                    imageUrl: sourceItem.imageUrl,
                    identifier: subdivision.identifier,
                    hasUniqueNumbering: sourceItem.hasUniqueNumbering,
                    isComposite: false,
                    metadata: newMetadata,
                    originTransformationId: transformation.id,
                    deletedAt: null,
                    deletionReason: null
                })

                // Add to transformation
                await this.transformationRepository.addResultItem(
                    transformation.id,
                    newItem.id,
                    1
                )

                resultItems.push({
                    id: newItem.id,
                    identifier: newItem.identifier,
                    name: newItem.name
                })
            }

            return {
                success: true,
                transformation: {
                    id: transformation.id,
                    type: transformation.type,
                    resultItems
                }
            }
        } catch (error) {
            console.error('Error in SubdivideItemUseCase:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            }
        }
    }

    private getValueFieldFromMetadata(metadata: Record<string, unknown>, unit: string): string | null {
        // Try to find the field that matches the unit
        for (const [key, value] of Object.entries(metadata)) {
            if (typeof value === 'number') {
                // Common field names by unit
                if (unit === 'm' && key === 'length') return 'length'
                if (unit === 'cm' && key === 'length') return 'length'
                if (unit === 'kg' && key === 'weight') return 'weight'
                if (unit === 'g' && key === 'weight') return 'weight'
            }
        }
        return null
    }
}
