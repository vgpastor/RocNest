// Domain Layer - Value Objects
// CategoryName Value Object (Immutable)

import { Either, left, right } from '@/lib/either'
import { DomainError } from '../errors/DomainError'

export class InvalidCategoryNameError extends DomainError {
    constructor(name: string, reason: string) {
        super(`Invalid category name '${name}': ${reason}`)
    }
}

export class CategoryName {
    private static readonly MIN_LENGTH = 2
    private static readonly MAX_LENGTH = 50
    private static readonly VALID_PATTERN = /^[a-zA-Z0-9\s\-áéíóúÁÉÍÓÚñÑ]+$/

    private constructor(private readonly value: string) {}

    // Factory method with validation
    static create(value: string): Either<InvalidCategoryNameError, CategoryName> {
        // Trim whitespace
        const trimmed = value.trim()

        // Validate empty
        if (trimmed.length === 0) {
            return left(
                new InvalidCategoryNameError(value, 'Category name cannot be empty')
            )
        }

        // Validate length
        if (trimmed.length < CategoryName.MIN_LENGTH) {
            return left(
                new InvalidCategoryNameError(
                    value,
                    `Category name must be at least ${CategoryName.MIN_LENGTH} characters`
                )
            )
        }

        if (trimmed.length > CategoryName.MAX_LENGTH) {
            return left(
                new InvalidCategoryNameError(
                    value,
                    `Category name must not exceed ${CategoryName.MAX_LENGTH} characters`
                )
            )
        }

        // Validate pattern (alphanumeric, spaces, hyphens, spanish chars)
        if (!CategoryName.VALID_PATTERN.test(trimmed)) {
            return left(
                new InvalidCategoryNameError(
                    value,
                    'Category name must contain only letters, numbers, spaces, and hyphens'
                )
            )
        }

        // Normalize: single spaces, capitalize first letter of each word
        const normalized = trimmed
            .replace(/\s+/g, ' ') // Multiple spaces to single space
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')

        return right(new CategoryName(normalized))
    }

    // Factory method from string (convenience)
    static fromString(value: string): Either<InvalidCategoryNameError, CategoryName> {
        return CategoryName.create(value)
    }

    // Queries
    getLength(): number {
        return this.value.length
    }

    isShort(): boolean {
        return this.value.length <= 15
    }

    isLong(): boolean {
        return this.value.length > 30
    }

    containsWord(word: string): boolean {
        return this.value.toLowerCase().includes(word.toLowerCase())
    }

    // Comparison
    equals(other: CategoryName): boolean {
        return this.value === other.value
    }

    equalsIgnoreCase(other: CategoryName): boolean {
        return this.value.toLowerCase() === other.value.toLowerCase()
    }

    // Conversion
    toString(): string {
        return this.value
    }

    toJSON(): string {
        return this.value
    }

    getValue(): string {
        return this.value
    }

    // For slug generation
    toSlug(): string {
        return this.value
            .toLowerCase()
            .normalize('NFD') // Decompose accented characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/\s+/g, '-') // Spaces to hyphens
            .replace(/[^\w\-]+/g, '') // Remove non-word chars except hyphens
            .replace(/\-\-+/g, '-') // Multiple hyphens to single hyphen
            .replace(/^-+/, '') // Remove leading hyphens
            .replace(/-+$/, '') // Remove trailing hyphens
    }
}
