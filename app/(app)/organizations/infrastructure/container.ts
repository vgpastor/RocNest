// Infrastructure Layer - Composition root for the organizations bounded context.
// One place decides which adapter implements each port; callers depend on use cases.

import { InvitationEmailComposer } from '../application/services/InvitationEmailComposer'
import { MembershipAuthorizationService } from '../application/services/MembershipAuthorizationService'
import { AcceptInvitationUseCase } from '../application/use-cases/AcceptInvitationUseCase'
import { ChangeMemberRoleUseCase } from '../application/use-cases/ChangeMemberRoleUseCase'
import { GetInvitationUseCase } from '../application/use-cases/GetInvitationUseCase'
import { InviteMemberUseCase } from '../application/use-cases/InviteMemberUseCase'
import { ListMembersUseCase } from '../application/use-cases/ListMembersUseCase'
import { RemoveMemberUseCase } from '../application/use-cases/RemoveMemberUseCase'
import { SwitchOrganizationUseCase } from '../application/use-cases/SwitchOrganizationUseCase'
import type { IInvitationRepository } from '../domain/IInvitationRepository'
import type { IMembershipRepository } from '../domain/IMembershipRepository'
import type { IEmailSender } from '../domain/services/IEmailSender'

import { PrismaInvitationRepository } from './PrismaInvitationRepository'
import { PrismaMembershipRepository } from './PrismaMembershipRepository'
import { SesEmailSender } from './SesEmailSender'

interface OrganizationDependencies {
    memberships: IMembershipRepository
    invitations: IInvitationRepository
    emailSender: IEmailSender
}

function defaults(): OrganizationDependencies {
    return {
        memberships: new PrismaMembershipRepository(),
        invitations: new PrismaInvitationRepository(),
        emailSender: new SesEmailSender(),
    }
}

/**
 * Overrides exist so tests can swap any adapter without touching the callers.
 */
export function organizationsModule(overrides: Partial<OrganizationDependencies> = {}) {
    const { memberships, invitations, emailSender } = { ...defaults(), ...overrides }
    const authorization = new MembershipAuthorizationService(memberships)

    return {
        listMembers: new ListMembersUseCase(memberships, authorization),
        inviteMember: new InviteMemberUseCase(
            invitations,
            authorization,
            emailSender,
            new InvitationEmailComposer()
        ),
        changeMemberRole: new ChangeMemberRoleUseCase(memberships, authorization),
        removeMember: new RemoveMemberUseCase(memberships, authorization),
        getInvitation: new GetInvitationUseCase(invitations, memberships),
        acceptInvitation: new AcceptInvitationUseCase(invitations, memberships),
        switchOrganization: new SwitchOrganizationUseCase(memberships),
    }
}
