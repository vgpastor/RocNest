// Application Layer - Use Case
// Create Item Use Case

import { Item } from '../../domain/entities/Item'
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository'
import { IStorageService } from '../../domain/services/IStorageService'
import { CreateItemInput, CreateItemOutput } from '../dtos/ItemDTOs'

export interface IItemRepository {
    create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item>
    findByIdentifier(identifier: string): Promise<Item | null>
    findById(id: string): Promise<Item | null>
    update(id: string, data: Partial<Item>): Promise<Item>
}

export interface IMetadataValidator {
    validate(categoryId: string, metadata: Record<string, unknown>): Promise<{
        valid: boolean
        errors?: Array<{ message?: string; [key: string]: unknown }>
    }>
}

export class CreateItemUseCase {
    constructor(
        private itemRepository: IItemRepository,
        private categoryRepository: ICategoryRepository,
        private storageService: IStorageService,
        private metadataValidator: IMetadataValidator,
        private getCurrentUserId: () => Promise<string>
    ) { }

    async execute(input: CreateItemInput): Promise<CreateItemOutput> {
        try {
            // 1. Validate category exists
            const category = await this.categoryRepository.findById(input.categoryId)
            if (!category) {
                return { success: false, error: 'Categoría no encontrada' }
            }

            // 2. Validate metadata against category schema
            const validation = await this.metadataValidator.validate(
                input.categoryId,
                input.metadata
            )
            if (!validation.valid) {
                return {
                    success: false,
                    error: `Metadata inválida: ${JSON.stringify(validation.errors)}`
                }
            }

            // 3. Validate quantity
            if (input.quantity < 1 || input.quantity > 100) {
                return { success: false, error: 'La cantidad debe estar entre 1 y 100' }
            }

            // 4. If no unique numbering, force quantity to 1
            if (!input.hasUniqueNumbering && input.quantity > 1) {
                return {
                    success: false,
                    error: 'Items sin numeración única solo pueden crearse de uno en uno'
                }
            }

            // 5. Upload image if provided
            let imageUrl: string | null = null
            if (input.imageFile) {
                try {
                    imageUrl = await this.storageService.uploadImage(
                        input.imageFile,
                        input.identifierBase
                    )
                } catch (_error) {
                    return { success: false, error: 'Error al subir la imagen' }
                }
            }

            // 6. Create items
            const createdItems: Array<{ id: string; identifier: string; name: string }> = []

            for (let i = 0; i < input.quantity; i++) {
                // Generate identifier
                const identifier = input.hasUniqueNumbering
                    ? `${input.identifierBase}-${String(i + 1).padStart(4, '0')}`
                    : input.identifierBase

                // Check if identifier already exists
                const existing = await this.itemRepository.findByIdentifier(identifier)
                if (existing) {
                    // Cleanup uploaded image if any item fails
                    if (imageUrl) {
                        await this.storageService.deleteImage(imageUrl)
                    }
                    return {
                        success: false,
                        error: `El código identificador ${identifier} ya existe`
                    }
                }

                // Create item
                const item = await this.itemRepository.create({
                    name: input.name,
                    description: input.description || null,
                    brand: input.brand,
                    model: input.model,
                    categoryId: input.categoryId,
                    organizationId: category.organizationId,
                    status: input.status,
                    imageUrl,
                    identifier,
                    hasUniqueNumbering: input.hasUniqueNumbering,
                    isComposite: false,
                    metadata: input.metadata,
                    originTransformationId: null,
                    deletedAt: null,
                    deletionReason: null
                })

                createdItems.push({
                    id: item.id,
                    identifier: item.identifier,
                    name: item.name
                })
            }

            return {
                success: true,
                items: createdItems
            }
        } catch (error) {
            console.error('Error in CreateItemUseCase:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            }
        }
    }
}
