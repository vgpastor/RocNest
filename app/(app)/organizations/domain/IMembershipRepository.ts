// Domain Layer - Repository port (implemented in infrastructure)

import type { Membership } from './types'
import type { OrganizationRole } from './value-objects/OrganizationRole'

export interface IMembershipRepository {
    findByUserAndOrganization(userId: string, organizationId: string): Promise<Membership | null>
    findByOrganization(organizationId: string): Promise<Membership[]>
    listOrganizationIdsForUser(userId: string): Promise<string[]>
    countAdministrators(organizationId: string): Promise<number>
    add(userId: string, organizationId: string, role: OrganizationRole): Promise<void>
    changeRole(userId: string, organizationId: string, role: OrganizationRole): Promise<Membership>
    remove(userId: string, organizationId: string): Promise<void>
}
