// Tipos compartidos para el sistema de seeds

import type { Prisma } from '@prisma/client'

export interface SeedOrganization {
    id: string
    name: string
    slug: string
    description?: string | null
    settings: Prisma.JsonValue
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
    metadataSchema: Prisma.JsonValue
}

export interface SeedProduct {
    id: string
    organizationId: string
    categoryId: string
    name: string
    brand?: string | null
    model?: string | null
    description?: string | null
    metadata: Prisma.JsonValue
}

export interface SeedItem {
    id: string
    organizationId: string
    productId: string
    identifier: string
    status: string
    metadata: Prisma.JsonValue
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
