// Application Layer - Use Case
// Deteriorate Item Use Case

import { DeteriorationMetadata } from '../../domain/entities/Transformation'
import { ItemStatus } from '../../domain/value-objects/ItemStatus'
import { TransformationType } from '../../domain/value-objects/TransformationType'
import { DeteriorateItemInput, DeteriorateItemOutput } from '../dtos/TransformationDTOs'

import { IItemRepository } from './CreateItemUseCase'
import { ITransformationRepository } from './SubdivideItemUseCase'

export class DeteriorateItemUseCase {
    constructor(
        private itemRepository: IItemRepository,
        private transformationRepository: ITransformationRepository,
        private getCurrentUserId: () => Promise<string>
    ) { }

    async execute(input: DeteriorateItemInput): Promise<DeteriorateItemOutput> {
        try {
            // 1. Validate item exists
            const item = await this.itemRepository.findById(input.itemId)
            if (!item) {
                return { success: false, error: 'Item no encontrado' }
            }

            // 2. Validate item can be deteriorated
            const isAvailable = item.status.isAvailable()
            const statusValue = item.status.toString()
            if (!isAvailable && statusValue !== 'maintenance') {
                return {
                    success: false,
                    error: `No se puede registrar deterioro de un item con estado "${item.status.getLabel()}"`
                }
            }

            // 3. Validate values
            if (input.damagedValue <= 0) {
                return { success: false, error: 'El valor dañado debe ser mayor a 0' }
            }

            if (input.remainingValue < 0) {
                return { success: false, error: 'El valor restante no puede ser negativo' }
            }

            if (input.originalValue !== input.damagedValue + input.remainingValue) {
                return {
                    success: false,
                    error: 'La suma del valor dañado y restante debe igual al valor original'
                }
            }

            // 4. Get current user
            const userId = await this.getCurrentUserId()

            // 5. Create transformation
            const metadata: DeteriorationMetadata = {
                originalValue: input.originalValue,
                damagedValue: input.damagedValue,
                remainingValue: input.remainingValue,
                damageLocation: input.damageLocation,
                damageReason: input.damageReason,
                unit: input.unit
            }

            const transformation = await this.transformationRepository.create({
                organizationId: item.organizationId,
                type: TransformationType.DETERIORATION,
                performedBy: userId,
                performedAt: new Date(),
                reason: input.damageReason,
                notes: input.notes || null,
                metadata
            })

            // 6. Add source item to transformation
            await this.transformationRepository.addSourceItem(
                transformation.id,
                item.id,
                1
            )

            // 7. Update original item with reduced value
            const updatedMetadata = { ...item.metadata }
            const valueField = this.getValueFieldFromMetadata(item.metadata, input.unit)
            if (valueField) {
                updatedMetadata[valueField] = input.remainingValue
            }

            await this.itemRepository.update(item.id, {
                metadata: updatedMetadata,
                status: input.remainingValue > 0 ? ItemStatus.available() : ItemStatus.discarded()
            })

            // 8. Create discarded item for the damaged portion
            const discardedIdentifier = `${item.identifier}-DESCARTE-${Date.now()}`

            const discardedMetadata = { ...item.metadata }
            if (valueField) {
                discardedMetadata[valueField] = input.damagedValue
            }
            discardedMetadata.damageReason = input.damageReason
            if (input.damageLocation) {
                discardedMetadata.damageLocation = input.damageLocation
            }

            const discardedItem = await this.itemRepository.create({
                name: `${item.name} (Desechado)`,
                description: `Porción desechada por: ${input.damageReason}`,
                brand: item.brand,
                model: item.model,
                categoryId: item.categoryId,
                organizationId: item.organizationId,
                status: ItemStatus.discarded(),
                imageUrl: null,
                identifier: discardedIdentifier,
                hasUniqueNumbering: false,
                isComposite: false,
                metadata: discardedMetadata,
                originTransformationId: transformation.id,
                deletedAt: null,
                deletionReason: null
            })

            // 9. Add discarded item to transformation as result
            await this.transformationRepository.addResultItem(
                transformation.id,
                discardedItem.id,
                1,
                'Porción desechada'
            )

            return {
                success: true,
                transformation: {
                    id: transformation.id,
                    updatedItem: {
                        id: item.id,
                        identifier: item.identifier
                    },
                    discardedItem: {
                        id: discardedItem.id,
                        identifier: discardedItem.identifier
                    }
                }
            }
        } catch (error) {
            console.error('Error in DeteriorateItemUseCase:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            }
        }
    }

    private getValueFieldFromMetadata(metadata: Record<string, any>, unit: string): string | null {
        for (const [key, value] of Object.entries(metadata)) {
            if (typeof value === 'number') {
                if (unit === 'm' && key === 'length') return 'length'
                if (unit === 'cm' && key === 'length') return 'length'
                if (unit === 'kg' && key === 'weight') return 'weight'
                if (unit === 'g' && key === 'weight') return 'weight'
            }
        }
        return null
    }
}
