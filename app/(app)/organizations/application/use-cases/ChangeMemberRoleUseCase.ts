// Use Case: change a member's role

import { LastAdministratorError, MemberNotFoundError } from '../../domain/errors/OrganizationErrors'
import type { IMembershipRepository } from '../../domain/IMembershipRepository'
import type { Membership } from '../../domain/types'
import { OrganizationRole } from '../../domain/value-objects/OrganizationRole'
import type { MembershipAuthorizationService } from '../services/MembershipAuthorizationService'

export interface ChangeMemberRoleRequest {
    requesterId: string
    organizationId: string
    targetUserId: string
    role: string
}

export class ChangeMemberRoleUseCase {
    constructor(
        private readonly memberships: IMembershipRepository,
        private readonly authorization: MembershipAuthorizationService
    ) {}

    async execute(request: ChangeMemberRoleRequest): Promise<Membership> {
        await this.authorization.requireMemberManager(request.requesterId, request.organizationId)

        const role = OrganizationRole.assignableFromString(request.role)
        const target = await this.memberships.findByUserAndOrganization(
            request.targetUserId,
            request.organizationId
        )

        if (!target) {
            throw new MemberNotFoundError()
        }

        // Business rule: an organization always keeps at least one administrator
        if (target.role.isAdministrative() && !role.isAdministrative()) {
            const administrators = await this.memberships.countAdministrators(request.organizationId)
            if (administrators <= 1) {
                throw new LastAdministratorError('demote')
            }
        }

        return this.memberships.changeRole(request.targetUserId, request.organizationId, role)
    }
}
