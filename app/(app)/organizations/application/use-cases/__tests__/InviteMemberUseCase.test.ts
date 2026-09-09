import { describe, it, expect, beforeEach } from 'vitest'

import {
    InsufficientPermissionsError,
    InvitationEmailRequiredError,
    InvalidOrganizationRoleError,
    NotOrganizationMemberError,
} from '../../../domain/errors/OrganizationErrors'
import { InvitationEmailComposer } from '../../services/InvitationEmailComposer'
import { MembershipAuthorizationService } from '../../services/MembershipAuthorizationService'
import { InviteMemberUseCase } from '../InviteMemberUseCase'

import {
    FakeEmailSender,
    InMemoryInvitationRepository,
    InMemoryMembershipRepository,
    membership,
    ORG,
} from './testDoubles'

function build(role: string) {
    const memberships = new InMemoryMembershipRepository([membership({ userId: 'user-1', role })])
    const invitations = new InMemoryInvitationRepository()
    const emailSender = new FakeEmailSender()

    const useCase = new InviteMemberUseCase(
        invitations,
        new MembershipAuthorizationService(memberships),
        emailSender,
        new InvitationEmailComposer()
    )

    return { useCase, invitations, emailSender }
}

const request = {
    organizationId: ORG.id,
    invitedBy: 'user-1',
    email: 'Nuevo@ICEM.test',
    role: 'admin',
    appUrl: 'https://rocnest.app',
}

describe('InviteMemberUseCase', () => {
    let subject: ReturnType<typeof build>

    beforeEach(() => {
        subject = build('admin')
    })

    it('creates the invitation and returns an absolute link', async () => {
        const result = await subject.useCase.execute(request)

        expect(result.invitationLink).toBe('https://rocnest.app/invitations/accept?token=token-1')
        expect(result.emailSent).toBe(true)
    })

    it('normalizes the email so invitations are not duplicated by case', async () => {
        const result = await subject.useCase.execute(request)
        expect(result.invitation.email).toBe('nuevo@icem.test')
    })

    it('sends the invitation email with the link', async () => {
        await subject.useCase.execute(request)

        expect(subject.emailSender.sent).toHaveLength(1)
        expect(subject.emailSender.sent[0].to).toBe('nuevo@icem.test')
        expect(subject.emailSender.sent[0].text).toContain('/invitations/accept?token=token-1')
    })

    it('still returns the link when delivery fails', async () => {
        subject.emailSender.shouldFail = true

        const result = await subject.useCase.execute(request)

        expect(result.emailSent).toBe(false)
        expect(result.invitationLink).toContain('/invitations/accept?token=')
    })

    it('caduca la invitacion pendiente anterior al reinvitar', async () => {
        const first = await subject.useCase.execute(request)
        const second = await subject.useCase.execute(request)

        const previous = subject.invitations.all.find((row) => row.token === first.invitation.token)!
        const current = subject.invitations.all.find((row) => row.token === second.invitation.token)!

        expect(previous.token).not.toBe(current.token)
        expect(previous.expiresAt.getTime()).toBeLessThanOrEqual(Date.now())
        expect(current.expiresAt.getTime()).toBeGreaterThan(Date.now())
    })

    it('no toca invitaciones de otras direcciones', async () => {
        await subject.useCase.execute({ ...request, email: 'otra@icem.test' })
        await subject.useCase.execute(request)

        const other = subject.invitations.all.find((row) => row.email === 'otra@icem.test')!
        expect(other.expiresAt.getTime()).toBeGreaterThan(Date.now())
    })

    it('lets an owner invite', async () => {
        const asOwner = build('owner')
        await expect(asOwner.useCase.execute(request)).resolves.toBeDefined()
    })

    it('rejects a plain member', async () => {
        const asMember = build('member')
        await expect(asMember.useCase.execute(request)).rejects.toThrow(InsufficientPermissionsError)
    })

    it('rejects somebody outside the organization', async () => {
        await expect(
            subject.useCase.execute({ ...request, invitedBy: 'stranger' })
        ).rejects.toThrow(NotOrganizationMemberError)
    })

    it('requires an email', async () => {
        await expect(subject.useCase.execute({ ...request, email: '   ' })).rejects.toThrow(
            InvitationEmailRequiredError
        )
    })

    it('refuses to hand out the owner role', async () => {
        await expect(subject.useCase.execute({ ...request, role: 'owner' })).rejects.toThrow(
            InvalidOrganizationRoleError
        )
    })
})
