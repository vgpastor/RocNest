// Domain Layer - Value Objects
// ItemStatus Value Object (Immutable)

import { Either, left, right } from '@/lib/either'

import { InvalidItemStatusError } from '../errors/DomainError'

type StatusVariant = 'default' | 'success' | 'warning' | 'destructive' | 'secondary'

interface StatusLabel {
    label: string
    variant: StatusVariant
}

export class ItemStatus {
    private static readonly VALID_STATUSES = [
        'available',
        'reserved',
        'in_use',
        'maintenance',
        'subdivided',
        'donated',
        'discarded',
        'lost',
        'disassembled',
    ] as const

    private static readonly LABELS: Record<string, StatusLabel> = {
        available: { label: 'Disponible', variant: 'success' },
        reserved: { label: 'Reservado', variant: 'warning' },
        in_use: { label: 'En Uso', variant: 'warning' },
        maintenance: { label: 'Mantenimiento', variant: 'secondary' },
        subdivided: { label: 'Subdividido', variant: 'secondary' },
        donated: { label: 'Donado', variant: 'default' },
        discarded: { label: 'Desechado', variant: 'destructive' },
        lost: { label: 'Extraviado', variant: 'destructive' },
        disassembled: { label: 'Desensamblado', variant: 'secondary' },
    }

    private constructor(private readonly value: string) {}

    // Factory method with validation
    static create(value: string): Either<InvalidItemStatusError, ItemStatus> {
        if (!(ItemStatus.VALID_STATUSES as readonly string[]).includes(value)) {
            return left(new InvalidItemStatusError(value))
        }
        return right(new ItemStatus(value))
    }

    // Static factory methods for common statuses
    static available(): ItemStatus {
        return new ItemStatus('available')
    }

    static reserved(): ItemStatus {
        return new ItemStatus('reserved')
    }

    static inUse(): ItemStatus {
        return new ItemStatus('in_use')
    }

    static maintenance(): ItemStatus {
        return new ItemStatus('maintenance')
    }

    static subdivided(): ItemStatus {
        return new ItemStatus('subdivided')
    }

    static donated(): ItemStatus {
        return new ItemStatus('donated')
    }

    static discarded(): ItemStatus {
        return new ItemStatus('discarded')
    }

    static lost(): ItemStatus {
        return new ItemStatus('lost')
    }

    static disassembled(): ItemStatus {
        return new ItemStatus('disassembled')
    }

    // Queries - Business logic
    isAvailable(): boolean {
        return this.value === 'available'
    }

    canBeReserved(): boolean {
        return this.value === 'available'
    }

    canBeReturned(): boolean {
        return this.value === 'reserved' || this.value === 'in_use'
    }

    canBeUsed(): boolean {
        return this.value === 'available' || this.value === 'reserved'
    }

    canBeModified(): boolean {
        // Items in these states cannot be modified
        const immutableStates = ['donated', 'discarded', 'lost', 'disassembled']
        return !immutableStates.includes(this.value)
    }

    isTerminal(): boolean {
        // Terminal states (item lifecycle ended)
        const terminalStates = ['donated', 'discarded', 'lost', 'disassembled']
        return terminalStates.includes(this.value)
    }

    // Comparison
    equals(other: ItemStatus): boolean {
        return this.value === other.value
    }

    // Label and display
    getLabel(): string {
        return ItemStatus.LABELS[this.value]?.label || this.value
    }

    getVariant(): StatusVariant {
        return ItemStatus.LABELS[this.value]?.variant || 'default'
    }

    // Conversion
    toString(): string {
        return this.value
    }

    toJSON(): string {
        return this.value
    }

    // Get raw value (for persistence)
    getValue(): string {
        return this.value
    }
}

// Legacy enum for backwards compatibility (temporary)
export enum ItemStatusEnum {
    AVAILABLE = 'available',
    RESERVED = 'reserved',
    IN_USE = 'in_use',
    MAINTENANCE = 'maintenance',
    SUBDIVIDED = 'subdivided',
    DONATED = 'donated',
    DISCARDED = 'discarded',
    LOST = 'lost',
    DISASSEMBLED = 'disassembled'
}

// Legacy labels export for backwards compatibility (temporary)
export const ItemStatusLabels: Record<ItemStatusEnum, StatusLabel> = {
    [ItemStatusEnum.AVAILABLE]: { label: 'Disponible', variant: 'success' },
    [ItemStatusEnum.RESERVED]: { label: 'Reservado', variant: 'warning' },
    [ItemStatusEnum.IN_USE]: { label: 'En Uso', variant: 'warning' },
    [ItemStatusEnum.MAINTENANCE]: { label: 'Mantenimiento', variant: 'secondary' },
    [ItemStatusEnum.SUBDIVIDED]: { label: 'Subdividido', variant: 'secondary' },
    [ItemStatusEnum.DONATED]: { label: 'Donado', variant: 'default' },
    [ItemStatusEnum.DISCARDED]: { label: 'Desechado', variant: 'destructive' },
    [ItemStatusEnum.LOST]: { label: 'Extraviado', variant: 'destructive' },
    [ItemStatusEnum.DISASSEMBLED]: { label: 'Desensamblado', variant: 'secondary' }
}
