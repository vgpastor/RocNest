// Tipos compartidos para el sistema de seeds

export interface SeedOrganization {
    id: string
    name: string
    slug: string
    description?: string
    settings: any
}

export interface SeedUser {
    id: string
    authId?: string  // Puede ser null para usuarios mock
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
    description?: string
    icon?: string
    metadataSchema: any
}

export interface SeedProduct {
    id: string
    organizationId: string
    categoryId: string
    name: string
    brand?: string
    model?: string
    description?: string
    metadata: any
}

export interface SeedItem {
    id: string
    organizationId: string
    productId: string
    identifier: string
    status: 'available' | 'in_use' | 'maintenance' | 'retired'
    metadata: any
}

export interface SeedReservation {
    id: string
    organizationId: string
    responsibleUserId: string
    startDate: Date
    endDate: Date
    purpose: string
    status: 'pending' | 'approved' | 'delivered' | 'returned' | 'cancelled'
}

export type ItemStatus = 'available' | 'in_use' | 'maintenance' | 'retired'
export type ReservationStatus = 'pending' | 'approved' | 'delivered' | 'returned' | 'cancelled'
export type UserRole = 'admin' | 'member'
