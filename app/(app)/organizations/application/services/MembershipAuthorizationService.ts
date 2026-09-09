// Application Layer - Service
// Single place that answers "can this user manage members here?".

import {
    InsufficientPermissionsError,
    MemberNotFoundError,
    NotOrganizationMemberError,
    OwnerRoleProtectedError,
} from '../../domain/errors/OrganizationErrors'
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

    /**
     * Resolves the member being acted upon and checks the requester may touch them.
     * An owner can only be demoted or removed by another owner.
     *
     * @throws MemberNotFoundError when the target does not belong to the organization
     * @throws OwnerRoleProtectedError when a non-owner targets an owner
     */
    async requireActionableTarget(
        requesterId: string,
        organizationId: string,
        targetUserId: string
    ): Promise<Membership> {
        const requester = await this.requireMemberManager(requesterId, organizationId)
        const target = await this.memberships.findByUserAndOrganization(targetUserId, organizationId)

        if (!target) {
            throw new MemberNotFoundError()
        }

        if (!requester.role.canActOn(target.role)) {
            throw new OwnerRoleProtectedError()
        }

        return target
    }
}
