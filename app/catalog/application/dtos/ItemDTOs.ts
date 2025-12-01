// Application Layer - DTOs
// Item Creation DTOs

import { ItemStatus } from '../../domain/value-objects/ItemStatus'

export interface CreateItemInput {
    name: string
    description?: string
    brand: string
    model: string
    categoryId: string
    identifierBase: string
    hasUniqueNumbering: boolean
    quantity: number
    status: ItemStatus
    metadata: Record<string, any>
    imageFile?: File
}

export interface CreateItemOutput {
    success: boolean
    items?: Array<{
        id: string
        identifier: string
        name: string
    }>
    error?: string
}

export interface CreateCompositeItemInput {
    itemData: CreateItemInput
    components: Array<{
        itemId: string
        quantity: number
        notes?: string
    }>
}

export interface CreateCompositeItemOutput {
    success: boolean
    item?: {
        id: string
        identifier: string
        name: string
        components: Array<{
            itemId: string
            quantity: number
        }>
    }
    error?: string
}
