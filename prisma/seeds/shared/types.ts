// Tipos compartidos para el sistema de seeds

export interface SeedOrganization {
    id: string
    name: string
    slug: string
    description?: string | null
    settings: Record<string, unknown>
}

export interface SeedUser {
    id: string
    authId?: string | null // Puede ser null para usuarios mock
    email: string
    fullName: string
    organizationId: string
    role: 'admin' | 'member'
}

export interface SeedCategory {
    id: string
    organizationId: string
    name: string
    slug: string
    description?: string | null
    icon?: string | null
    metadataSchema: Record<string, unknown>
}

export interface SeedProduct {
    id: string
    organizationId: string
    categoryId: string
    name: string
    brand?: string | null
    model?: string | null
    description?: string | null
    metadata: Record<string, unknown>
}

export interface SeedItem {
    id: string
    organizationId: string
    productId: string
    identifier: string
    status: string
    metadata: Record<string, unknown>
}

export interface SeedReservation {
    id: string
    organizationId: string
    responsibleUserId: string
    startDate: Date
    estimatedReturnDate: Date
    purpose: string | null
    status: string
}

export type ItemStatus = 'available' | 'in_use' | 'maintenance' | 'retired'
export type ReservationStatus = 'pending' | 'approved' | 'delivered' | 'returned' | 'cancelled'
export type UserRole = 'admin' | 'member'
