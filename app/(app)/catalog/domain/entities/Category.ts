// Domain Layer - Entities
// Category Entity

export interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    icon: string | null
    requiresUniqueNumbering: boolean
    canBeComposite: boolean
    canBeSubdivided: boolean
    metadataSchema: CategoryMetadataSchema
    createdAt: Date
    updatedAt: Date
}

export interface CategoryMetadataField {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'
    label?: string
    unit?: string
    minimum?: number
    maximum?: number
    enum?: string[]
    items?: CategoryMetadataField
    format?: string
    required?: boolean
}

export interface CategoryMetadataSchema {
    type: 'object'
    properties: Record<string, CategoryMetadataField>
    required?: string[]
}
