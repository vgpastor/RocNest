// Helper function to get current organization ID from cookies
// Used in server components

import { cookies } from 'next/headers'

export async function getCurrentOrganizationId(): Promise<string | null> {
    const cookieStore = await cookies()
    const orgId = cookieStore.get('current-organization')?.value
    return orgId || null
}

/**
 * Gets the current organization ID or throws an error
 * Use this when organization context is required
 */
export async function requireOrganizationId(): Promise<string> {
    const orgId = await getCurrentOrganizationId()

    if (!orgId) {
        throw new Error('No organization selected. Please select an organization first.')
    }

    return orgId
}
