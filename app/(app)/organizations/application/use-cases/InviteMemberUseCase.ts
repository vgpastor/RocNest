// Use Case: invite somebody to an organization

import { InvitationEmailRequiredError } from '../../domain/errors/OrganizationErrors'
import type { IInvitationRepository } from '../../domain/IInvitationRepository'
import type { IEmailSender } from '../../domain/services/IEmailSender'
import type { Invitation } from '../../domain/types'
import { OrganizationRole } from '../../domain/value-objects/OrganizationRole'
import type { InvitationEmailComposer } from '../services/InvitationEmailComposer'
import type { MembershipAuthorizationService } from '../services/MembershipAuthorizationService'

const INVITATION_VALIDITY_DAYS = 7

export interface InviteMemberRequest {
    organizationId: string
    invitedBy: string
    email: string
    role: string
    /** Absolute base URL used to build the acceptance link. */
    appUrl: string
}

export interface InviteMemberResult {
    invitation: Invitation
    invitationLink: string
    emailSent: boolean
}

export class InviteMemberUseCase {
    constructor(
        private readonly invitations: IInvitationRepository,
        private readonly authorization: MembershipAuthorizationService,
        private readonly emailSender: IEmailSender,
        private readonly emailComposer: InvitationEmailComposer
    ) {}

    async execute(request: InviteMemberRequest): Promise<InviteMemberResult> {
        await this.authorization.requireMemberManager(request.invitedBy, request.organizationId)

        const email = request.email.trim().toLowerCase()
        if (!email) {
            throw new InvitationEmailRequiredError()
        }

        const role = OrganizationRole.assignableFromString(request.role)

        // Re-inviting replaces the previous link instead of leaving two redeemable ones
        await this.invitations.expirePendingFor(request.organizationId, email)

        const invitation = await this.invitations.create({
            organizationId: request.organizationId,
            email,
            role,
            invitedBy: request.invitedBy,
            expiresAt: this.expiryDate(),
        })

        const invitationLink = `${request.appUrl}/invitations/accept?token=${invitation.token}`

        return {
            invitation,
            invitationLink,
            emailSent: await this.deliver(invitation, invitationLink),
        }
    }

    /**
     * The link is the source of truth: a failed delivery must not lose the invitation,
     * the administrator can always share the link by hand.
     */
    private async deliver(invitation: Invitation, invitationLink: string): Promise<boolean> {
        try {
            await this.emailSender.send(this.emailComposer.compose(invitation, invitationLink))
            return true
        } catch (error) {
            console.error('Error sending invitation email:', error)
            return false
        }
    }

    private expiryDate(): Date {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + INVITATION_VALIDITY_DAYS)
        return expiresAt
    }
}
