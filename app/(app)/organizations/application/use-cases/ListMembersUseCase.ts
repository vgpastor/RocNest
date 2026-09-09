// Use Case: list the members of an organization

import type { IMembershipRepository } from '../../domain/IMembershipRepository'
import type { Membership } from '../../domain/types'
import type { MembershipAuthorizationService } from '../services/MembershipAuthorizationService'

export class ListMembersUseCase {
    constructor(
        private readonly memberships: IMembershipRepository,
        private readonly authorization: MembershipAuthorizationService
    ) {}

    async execute(requesterId: string, organizationId: string): Promise<Membership[]> {
        await this.authorization.requireMemberManager(requesterId, organizationId)
        return this.memberships.findByOrganization(organizationId)
    }
}
