import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'

export class OrganizationContextService {
    private static readonly COOKIE_NAME = 'current-organization'

    /**
     * Helper function to get current organization ID from cookies
     * Used in server components
     * @param userId Optional user ID to validate membership against
     */
    static async getCurrentOrganizationId(userId?: string): Promise<string | null> {
        const cookieStore = await cookies()
        const cookieOrgId = cookieStore.get(this.COOKIE_NAME)?.value

        // If no user ID provided, just return the cookie value
        if (!userId) {
            return cookieOrgId || null
        }

        // If user ID provided, validate membership
        if (cookieOrgId) {
            const membership = await prisma.userOrganization.findUnique({
                where: {
                    userId_organizationId: {
                        userId,
                        organizationId: cookieOrgId
                    }
                }
            })

            if (membership) {
                return cookieOrgId
            }
        }

        // Fallback: Get first organization for user
        const firstOrg = await prisma.userOrganization.findFirst({
            where: { userId },
            select: { organizationId: true }
        })

        return firstOrg?.organizationId || null
    }

    /**
     * Gets the current organization ID or throws an error
     * Use this when organization context is required
     */
    static async requireOrganizationId(userId?: string): Promise<string> {
        const orgId = await this.getCurrentOrganizationId(userId)

        if (!orgId) {
            throw new Error('No organization selected. Please select an organization first.')
        }

        return orgId
    }
}
