// Application Layer - DTOs
// Transformation DTOs

import { TransformationType } from '../../domain/value-objects/TransformationType'

export interface SubdivideItemInput {
    sourceItemId: string
    subdivisions: Array<{
        identifier: string
        value: number
    }>
    unit: string
    reason: string
    notes?: string
}

export interface SubdivideItemOutput {
    success: boolean
    transformation?: {
        id: string
        type: TransformationType
        resultItems: Array<{
            id: string
            identifier: string
            name: string
        }>
    }
    error?: string
}

export interface DisassembleItemInput {
    compositeItemId: string
    reason: string
    notes?: string
}

export interface DisassembleItemOutput {
    success: boolean
    transformation?: {
        id: string
        components: Array<{
            id: string
            identifier: string
            name: string
        }>
    }
    error?: string
}

export interface DonateItemsInput {
    itemIds: string[]
    location: string
    recipients: string[]
    reason: string
    notes?: string
    recoverable: boolean
}

export interface DonateItemsOutput {
    success: boolean
    transformation?: {
        id: string
        itemCount: number
    }
    error?: string
}

export interface DeteriorateItemInput {
    itemId: string
    originalValue: number
    damagedValue: number
    remainingValue: number
    damageLocation?: string
    damageReason: string
    unit: string
    notes?: string
}

export interface DeteriorateItemOutput {
    success: boolean
    transformation?: {
        id: string
        updatedItem: {
            id: string
            identifier: string
        }
        discardedItem: {
            id: string
            identifier: string
        }
    }
    error?: string
}
