// Application Layer - Service
// Single place that answers "can this user manage members here?".

import { InsufficientPermissionsError, NotOrganizationMemberError } from '../../domain/errors/OrganizationErrors'
import type { IMembershipRepository } from '../../domain/IMembershipRepository'
import type { Membership } from '../../domain/types'

export class MembershipAuthorizationService {
    constructor(private readonly memberships: IMembershipRepository) {}

    /**
     * @throws NotOrganizationMemberError when the user does not belong to the organization
     * @throws InsufficientPermissionsError when the user is a plain member
     */
    async requireMemberManager(userId: string, organizationId: string): Promise<Membership> {
        const membership = await this.memberships.findByUserAndOrganization(userId, organizationId)

        if (!membership) {
            throw new NotOrganizationMemberError()
        }

        if (!membership.role.canManageMembers()) {
            throw new InsufficientPermissionsError()
        }

        return membership
    }
}
