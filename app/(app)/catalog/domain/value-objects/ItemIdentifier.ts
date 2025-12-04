// Domain Layer - Value Objects
// ItemIdentifier Value Object (Immutable)

import { Either, left, right } from '@/lib/either'
import { InvalidItemIdentifierError } from '../errors/DomainError'

export class ItemIdentifier {
    private static readonly MIN_LENGTH = 1
    private static readonly MAX_LENGTH = 50
    private static readonly VALID_PATTERN = /^[A-Z0-9\-_]+$/i

    private constructor(private readonly value: string) {}

    // Factory method with validation
    static create(value: string): Either<InvalidItemIdentifierError, ItemIdentifier> {
        // Trim whitespace
        const trimmed = value.trim()

        // Validate length
        if (trimmed.length < ItemIdentifier.MIN_LENGTH) {
            return left(
                new InvalidItemIdentifierError(value, 'Identifier must not be empty')
            )
        }

        if (trimmed.length > ItemIdentifier.MAX_LENGTH) {
            return left(
                new InvalidItemIdentifierError(
                    value,
                    `Identifier must not exceed ${ItemIdentifier.MAX_LENGTH} characters`
                )
            )
        }

        // Validate pattern (alphanumeric, hyphens, underscores only)
        if (!ItemIdentifier.VALID_PATTERN.test(trimmed)) {
            return left(
                new InvalidItemIdentifierError(
                    value,
                    'Identifier must contain only letters, numbers, hyphens, and underscores'
                )
            )
        }

        return right(new ItemIdentifier(trimmed.toUpperCase()))
    }

    // Factory method for generating unique numbered identifiers
    static generateUnique(base: string, index: number): Either<InvalidItemIdentifierError, ItemIdentifier> {
        const paddedIndex = String(index).padStart(4, '0')
        const identifier = `${base}-${paddedIndex}`
        return ItemIdentifier.create(identifier)
    }

    // Factory method for simple identifiers (auto-validates)
    static fromString(value: string): Either<InvalidItemIdentifierError, ItemIdentifier> {
        return ItemIdentifier.create(value)
    }

    // Queries
    hasNumbering(): boolean {
        return /\d{4}$/.test(this.value) // Ends with 4 digits
    }

    getBase(): string {
        if (this.hasNumbering()) {
            return this.value.substring(0, this.value.lastIndexOf('-'))
        }
        return this.value
    }

    getNumber(): number | null {
        if (this.hasNumbering()) {
            const match = this.value.match(/(\d{4})$/)
            return match ? parseInt(match[1], 10) : null
        }
        return null
    }

    // Comparison
    equals(other: ItemIdentifier): boolean {
        return this.value === other.value
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
}
