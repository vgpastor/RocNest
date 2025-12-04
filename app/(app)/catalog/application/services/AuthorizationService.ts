// Application Layer - Service
// AuthorizationService
// Centralizes all authorization logic for catalog operations

import { prisma } from '@/lib/prisma'

export class AuthorizationService {
    /**
     * Check if user can manage items (create, update, delete) in an organization
     */
    async canManageItems(userId: string, organizationId: string): Promise<boolean> {
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId,
                },
            },
        })

        if (!membership) {
            return false
        }

        // Admin and Owner roles can manage items
        return membership.role === 'admin' || membership.role === 'owner'
    }

    /**
     * Check if user can view items in an organization
     */
    async canViewItems(userId: string, organizationId: string): Promise<boolean> {
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId,
                },
            },
        })

        // All members can view items
        return membership !== null
    }

    /**
     * Check if user can manage categories in an organization
     */
    async canManageCategories(userId: string, organizationId: string): Promise<boolean> {
        // Same permissions as managing items
        return this.canManageItems(userId, organizationId)
    }

    /**
     * Check if user can perform transformations (subdivide, donate, etc.)
     */
    async canPerformTransformations(userId: string, organizationId: string): Promise<boolean> {
        // Same permissions as managing items
        return this.canManageItems(userId, organizationId)
    }

    /**
     * Check if user is owner of an organization
     */
    async isOwner(userId: string, organizationId: string): Promise<boolean> {
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId,
                },
            },
        })

        return membership?.role === 'owner'
    }

    /**
     * Get user role in organization
     */
    async getUserRole(userId: string, organizationId: string): Promise<string | null> {
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId,
                },
            },
        })

        return membership?.role || null
    }
}
