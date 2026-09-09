/**
 * Name of the cookie holding the active organization.
 *
 * Lives on its own so the proxy (edge) and OrganizationContextService (which pulls in
 * next/headers and Prisma) can share it without the proxy importing any of that.
 */
export const CURRENT_ORGANIZATION_COOKIE = 'current-organization'
