// Use Case: accept an invitation and join the organization.
// Returns the data the caller needs to refresh the session; cookies are a delivery
// concern and stay in the Server Action.

import {
    InvitationAlreadyAcceptedError,
    InvitationExpiredError,
    InvitationNotFoundError,
} from '../../domain/errors/OrganizationErrors'
import type { IInvitationRepository } from '../../domain/IInvitationRepository'
import type { IMembershipRepository } from '../../domain/IMembershipRepository'

export interface AcceptInvitationRequest {
    token: string
    userId: string
}

export interface AcceptInvitationResult {
    organizationId: string
    organizationName: string
    /** Every organization the user belongs to after joining, for the new session token. */
    organizationIds: string[]
}

export class AcceptInvitationUseCase {
    constructor(
        private readonly invitations: IInvitationRepository,
        private readonly memberships: IMembershipRepository,
        private readonly now: () => Date = () => new Date()
    ) {}

    async execute(request: AcceptInvitationRequest): Promise<AcceptInvitationResult> {
        const invitation = await this.invitations.findByToken(request.token)

        // Re-validated here on purpose: the invitation may have changed between the
        // page render and the submit.
        if (!invitation) {
            throw new InvitationNotFoundError()
        }
        if (invitation.acceptedAt) {
            throw new InvitationAlreadyAcceptedError()
        }
        if (invitation.expiresAt < this.now()) {
            throw new InvitationExpiredError(invitation.expiresAt)
        }

        await this.invitations.acceptAndJoin(invitation, request.userId)

        return {
            organizationId: invitation.organization.id,
            organizationName: invitation.organization.name,
            organizationIds: await this.memberships.listOrganizationIdsForUser(request.userId),
        }
    }
}
