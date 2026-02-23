// Application Layer - Service
// ItemValidationService
// Centralizes complex validation logic for items

import { Either, left, right } from '@/lib/either'

import { CategoryMetadataField } from '../../domain/entities/Category'
import { InvalidMetadataError, DuplicateItemIdentifierError } from '../../domain/errors/DomainError'
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository'
import { IItemRepository } from '../../domain/repositories/IItemRepository'

export class ItemValidationService {
    constructor(
        private itemRepository: IItemRepository,
        private categoryRepository: ICategoryRepository
    ) {}

    /**
     * Validate metadata against category schema
     */
    async validateMetadata(
        categoryId: string,
        metadata: Record<string, unknown>
    ): Promise<Either<InvalidMetadataError, void>> {
        const category = await this.categoryRepository.findById(categoryId)

        if (!category) {
            return left(new InvalidMetadataError(['Category not found']))
        }

        const schema = category.metadataSchema
        const properties = schema?.properties || {}
        const errors: string[] = []

        // Validate required fields
        for (const [fieldName, fieldDef] of Object.entries(properties) as Array<[string, CategoryMetadataField]>) {
            if (fieldDef.required && !(fieldName in metadata)) {
                errors.push(`Field '${fieldName}' is required`)
            }

            // Validate type if field exists
            if (fieldName in metadata) {
                const value = metadata[fieldName]
                const expectedType = fieldDef.type

                if (expectedType === 'string' && typeof value !== 'string') {
                    errors.push(`Field '${fieldName}' must be a string`)
                } else if (expectedType === 'number' && typeof value !== 'number') {
                    errors.push(`Field '${fieldName}' must be a number`)
                } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
                    errors.push(`Field '${fieldName}' must be a boolean`)
                }

                // Validate string length
                if (expectedType === 'string' && typeof value === 'string') {
                    if (fieldDef.minimum && value.length < fieldDef.minimum) {
                        errors.push(`Field '${fieldName}' must be at least ${fieldDef.minimum} characters`)
                    }
                    if (fieldDef.maximum && value.length > fieldDef.maximum) {
                        errors.push(`Field '${fieldName}' must not exceed ${fieldDef.maximum} characters`)
                    }
                }

                // Validate number range
                if (expectedType === 'number' && typeof value === 'number') {
                    if (fieldDef.minimum !== undefined && value < fieldDef.minimum) {
                        errors.push(`Field '${fieldName}' must be at least ${fieldDef.minimum}`)
                    }
                    if (fieldDef.maximum !== undefined && value > fieldDef.maximum) {
                        errors.push(`Field '${fieldName}' must not exceed ${fieldDef.maximum}`)
                    }
                }
            }
        }

        if (errors.length > 0) {
            return left(new InvalidMetadataError(errors))
        }

        return right(undefined)
    }

    /**
     * Check if identifier is unique
     */
    async validateUniqueIdentifier(identifier: string): Promise<Either<DuplicateItemIdentifierError, void>> {
        const exists = await this.itemRepository.existsByIdentifier(identifier)
        
        if (exists) {
            return left(new DuplicateItemIdentifierError(identifier))
        }

        return right(undefined)
    }

    /**
     * Validate quantity for item creation
     */
    validateQuantity(quantity: number, hasUniqueNumbering: boolean): Either<InvalidMetadataError, void> {
        const errors: string[] = []

        if (quantity < 1) {
            errors.push('Quantity must be at least 1')
        }

        if (quantity > 100) {
            errors.push('Quantity must not exceed 100')
        }

        if (!hasUniqueNumbering && quantity > 1) {
            errors.push('Items without unique numbering can only be created one at a time')
        }

        if (errors.length > 0) {
            return left(new InvalidMetadataError(errors))
        }

        return right(undefined)
    }
}
