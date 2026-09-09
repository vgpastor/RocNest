// Use Case: remove a member from an organization

import { LastAdministratorError, MemberNotFoundError } from '../../domain/errors/OrganizationErrors'
import type { IMembershipRepository } from '../../domain/IMembershipRepository'
import type { MembershipAuthorizationService } from '../services/MembershipAuthorizationService'

export interface RemoveMemberRequest {
    requesterId: string
    organizationId: string
    targetUserId: string
}

export class RemoveMemberUseCase {
    constructor(
        private readonly memberships: IMembershipRepository,
        private readonly authorization: MembershipAuthorizationService
    ) {}

    async execute(request: RemoveMemberRequest): Promise<void> {
        await this.authorization.requireMemberManager(request.requesterId, request.organizationId)

        const target = await this.memberships.findByUserAndOrganization(
            request.targetUserId,
            request.organizationId
        )

        if (!target) {
            throw new MemberNotFoundError()
        }

        // Business rule: an organization always keeps at least one administrator
        if (target.role.isAdministrative()) {
            const administrators = await this.memberships.countAdministrators(request.organizationId)
            if (administrators <= 1) {
                throw new LastAdministratorError('remove')
            }
        }

        await this.memberships.remove(request.targetUserId, request.organizationId)
    }
}
