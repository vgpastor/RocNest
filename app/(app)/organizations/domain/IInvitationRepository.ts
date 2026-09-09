// Domain Layer - Repository port (implemented in infrastructure)

import type { Invitation, NewInvitation } from './types'

export interface IInvitationRepository {
    create(invitation: NewInvitation): Promise<Invitation>
    findByToken(token: string): Promise<Invitation | null>
    /**
     * Expires every invitation still pending for that address so re-inviting somebody
     * leaves a single live link instead of several redeemable ones.
     * @returns how many invitations were expired
     */
    expirePendingFor(organizationId: string, email: string): Promise<number>
    /**
     * Joins the invitee and closes the invitation atomically: a membership without a
     * consumed invitation (or the other way round) would let the link be replayed.
     */
    acceptAndJoin(invitation: Invitation, userId: string): Promise<void>
}
