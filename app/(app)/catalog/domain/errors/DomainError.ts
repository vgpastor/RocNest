// Domain Layer - Catalog domain errors
// The base class lives in the shared kernel so every bounded context reuses it.

import { DomainError } from '@/lib/domain/DomainError'

export { DomainError }

// Catalog Domain Errors
export class ItemNotFoundError extends DomainError {
    constructor(itemId: string) {
        super(`Item with id ${itemId} not found`)
    }
}

export class ItemNotAvailableError extends DomainError {
    constructor(itemId: string, currentStatus: string) {
        super(`Item ${itemId} is not available (current status: ${currentStatus})`)
    }
}

export class ItemNotReservedError extends DomainError {
    constructor(itemId: string) {
        super(`Item ${itemId} is not reserved`)
    }
}

export class InvalidItemStatusError extends DomainError {
    constructor(status: string) {
        super(`Invalid item status: ${status}`)
    }
}

export class InvalidItemIdentifierError extends DomainError {
    constructor(identifier: string, reason: string) {
        super(`Invalid item identifier '${identifier}': ${reason}`)
    }
}

export class DuplicateItemIdentifierError extends DomainError {
    constructor(identifier: string) {
        super(`Item with identifier '${identifier}' already exists`)
    }
}

export class CategoryNotFoundError extends DomainError {
    constructor(categoryId: string) {
        super(`Category with id ${categoryId} not found`)
    }
}

export class InvalidMetadataError extends DomainError {
    constructor(errors: string[]) {
        super(`Invalid metadata: ${errors.join(', ')}`)
    }
}
