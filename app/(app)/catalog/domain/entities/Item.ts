// Domain Layer - Entities
// Item Entity (Aggregate Root)

import { ItemStatus } from '../value-objects/ItemStatus'

export interface Item {
    id: string
    name: string
    description: string | null
    brand: string
    model: string
    categoryId: string
    status: ItemStatus
    imageUrl: string | null
    identifier: string
    hasUniqueNumbering: boolean
    isComposite: boolean
    metadata: Record<string, any>
    originTransformationId: string | null
    deletedAt: Date | null
    deletionReason: string | null
    createdAt: Date
    updatedAt: Date
}

export interface ItemComponent {
    id: string
    parentItemId: string
    componentItemId: string
    quantity: number
    notes: string | null
    createdAt: Date
}

export interface ItemWithCategory extends Item {
    category: {
        id: string
        name: string
        slug: string
        icon: string | null
        metadataSchema: Record<string, any>
    }
}

export interface ItemWithComponents extends Item {
    components: Array<{
        id: string
        componentItem: Item
        quantity: number
        notes: string | null
    }>
}
