// Infrastructure Layer - Metadata Validator Service

import Ajv from 'ajv'
import addFormats from 'ajv-formats'

import { IMetadataValidator } from '../../application/use-cases/CreateItemUseCase'
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository'

export class MetadataValidatorService implements IMetadataValidator {
    private ajv: Ajv

    constructor(private categoryRepository: ICategoryRepository) {
        this.ajv = new Ajv({ allErrors: true })
        addFormats(this.ajv)
    }

    async validate(
        categoryId: string,
        metadata: Record<string, unknown>
    ): Promise<{ valid: boolean; errors?: Array<{ message?: string; [key: string]: unknown }> }> {
        // Get category schema
        const category = await this.categoryRepository.findById(categoryId)
        if (!category) {
            return { valid: false, errors: [{ message: 'Category not found' }] }
        }

        // If no schema defined, accept any metadata
        if (!category.metadataSchema || Object.keys(category.metadataSchema).length === 0) {
            return { valid: true }
        }

        // Validate against JSON Schema
        const validate = this.ajv.compile(category.metadataSchema)
        const valid = validate(metadata)

        if (!valid) {
            return {
                valid: false,
                errors: validate.errors || []
            }
        }

        return { valid: true }
    }
}
