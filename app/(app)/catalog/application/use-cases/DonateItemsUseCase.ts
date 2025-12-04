// Application Layer - Use Case
// Donate Items Use Case

import { DonateItemsInput, DonateItemsOutput } from '../dtos/TransformationDTOs'
import { Transformation, DonationMetadata } from '../../domain/entities/Transformation'
import { TransformationType } from '../../domain/value-objects/TransformationType'
import { ItemStatus } from '../../domain/value-objects/ItemStatus'
import { IItemRepository } from './CreateItemUseCase'
import { ITransformationRepository } from './SubdivideItemUseCase'

export class DonateItemsUseCase {
    constructor(
        private itemRepository: IItemRepository,
        private transformationRepository: ITransformationRepository,
        private getCurrentUserId: () => Promise<string>
    ) { }

    async execute(input: DonateItemsInput): Promise<DonateItemsOutput> {
        try {
            let organizationId: string | null = null

            // 1. Validate items exist and can be donated
            for (const itemId of input.itemIds) {
                const item = await this.itemRepository.findById(itemId)

                if (!item) {
                    return {
                        success: false,
                        error: `Item con ID ${itemId} no encontrado`
                    }
                }

                if (!organizationId) {
                    organizationId = item.organizationId
                } else if (organizationId !== item.organizationId) {
                    return {
                        success: false,
                        error: 'Todos los items deben pertenecer a la misma organización'
                    }
                }

                // Check if item can be donated
                const statusValue = item.status.toString()
                if (statusValue === 'donated') {
                    return {
                        success: false,
                        error: `El item "${item.name}" ya está donado`
                    }
                }

                if (statusValue === 'reserved' || statusValue === 'in_use') {
                    return {
                        success: false,
                        error: `El item "${item.name}" está ${item.status.getLabel()} y no puede ser donado`
                    }
                }
            }

            if (!organizationId) {
                return { success: false, error: 'No se pudo determinar la organización' }
            }

            // 2. Get current user
            const userId = await this.getCurrentUserId()

            // 3. Create transformation
            const metadata: DonationMetadata = {
                location: input.location,
                recipients: input.recipients,
                recoverable: input.recoverable
            }

            const transformation = await this.transformationRepository.create({
                organizationId,
                type: TransformationType.DONATION,
                performedBy: userId,
                performedAt: new Date(),
                reason: input.reason,
                notes: input.notes || null,
                metadata
            })

            // 4. Update items and add to transformation
            for (const itemId of input.itemIds) {
                // Add to transformation as source
                await this.transformationRepository.addSourceItem(
                    transformation.id,
                    itemId,
                    1,
                    `Donado a ${input.location}`
                )

                // Update item status
                await this.itemRepository.update(itemId, {
                    status: ItemStatus.donated()
                })
            }

            return {
                success: true,
                transformation: {
                    id: transformation.id,
                    itemCount: input.itemIds.length
                }
            }
        } catch (error) {
            console.error('Error in DonateItemsUseCase:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            }
        }
    }
}
