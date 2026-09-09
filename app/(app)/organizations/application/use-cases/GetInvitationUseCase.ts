// Use Case: read an invitation and decide what the invitee should see.
// Keeps the acceptance rules out of the page component.

import type { IInvitationRepository } from '../../domain/IInvitationRepository'
import type { IMembershipRepository } from '../../domain/IMembershipRepository'
import type { Invitation } from '../../domain/types'

export type InvitationState =
    | { status: 'not-found' }
    | { status: 'already-accepted'; invitation: Invitation }
    | { status: 'expired'; invitation: Invitation }
    | { status: 'already-member'; invitation: Invitation }
    | { status: 'acceptable'; invitation: Invitation }

export class GetInvitationUseCase {
    constructor(
        private readonly invitations: IInvitationRepository,
        private readonly memberships: IMembershipRepository,
        private readonly now: () => Date = () => new Date()
    ) {}

    async execute(token: string, userId: string): Promise<InvitationState> {
        const invitation = await this.invitations.findByToken(token)

        if (!invitation) {
            return { status: 'not-found' }
        }

        if (invitation.acceptedAt) {
            return { status: 'already-accepted', invitation }
        }

        if (invitation.expiresAt < this.now()) {
            return { status: 'expired', invitation }
        }

        const membership = await this.memberships.findByUserAndOrganization(
            userId,
            invitation.organization.id
        )

        if (membership) {
            return { status: 'already-member', invitation }
        }

        return { status: 'acceptable', invitation }
    }
}
