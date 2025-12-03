// Domain Layer - Entities
// Transformation Entity (Aggregate Root)

import { TransformationType } from '../value-objects/TransformationType'

export interface Transformation {
    id: string
    organizationId: string
    type: TransformationType
    performedBy: string
    performedAt: Date
    reason: string
    notes: string | null
    metadata: Record<string, any>
    createdAt: Date
}

export interface TransformationItem {
    id: string
    transformationId: string
    itemId: string
    role: 'source' | 'result'
    quantity: number
    notes: string | null
    createdAt: Date
}

export interface TransformationWithItems extends Transformation {
    sourceItems: Array<{
        id: string
        item: {
            id: string
            name: string
            identifier: string
        }
        quantity: number
        notes: string | null
    }>
    resultItems: Array<{
        id: string
        item: {
            id: string
            name: string
            identifier: string
        }
        quantity: number
        notes: string | null
    }>
}

// Metadata types for different transformation types
export interface SubdivisionMetadata {
    originalLength: number
    subdivisions: Array<{
        identifier: string
        value: number
    }>
    unit: string
}

export interface DeteriorationMetadata {
    originalValue: number
    damagedValue: number
    remainingValue: number
    damageLocation?: string
    damageReason: string
    unit: string
}

export interface DonationMetadata {
    location: string
    recipients: string[]
    recoverable: boolean
}

export interface AssemblyMetadata {
    components: Array<{
        itemId: string
        quantity: number
    }>
}
