// Use Case: change the user's active organization

import { NotOrganizationMemberError } from '../../domain/errors/OrganizationErrors'
import type { IMembershipRepository } from '../../domain/IMembershipRepository'

export interface SwitchOrganizationResult {
    organizationId: string
    /** Every organization the user belongs to, for a session token in sync with reality. */
    organizationIds: string[]
}

export class SwitchOrganizationUseCase {
    constructor(private readonly memberships: IMembershipRepository) {}

    async execute(userId: string, organizationId: string): Promise<SwitchOrganizationResult> {
        const membership = await this.memberships.findByUserAndOrganization(userId, organizationId)

        if (!membership) {
            throw new NotOrganizationMemberError()
        }

        return {
            organizationId,
            organizationIds: await this.memberships.listOrganizationIdsForUser(userId),
        }
    }
}
