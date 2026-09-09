import { describe, it, expect } from 'vitest'

import {
    InvitationAlreadyAcceptedError,
    InvitationExpiredError,
    InvitationNotFoundError,
} from '../../../domain/errors/OrganizationErrors'
import { AcceptInvitationUseCase } from '../AcceptInvitationUseCase'
import { GetInvitationUseCase } from '../GetInvitationUseCase'

import {
    InMemoryInvitationRepository,
    InMemoryMembershipRepository,
    invitation,
    membership,
    ORG,
} from './testDoubles'

const NOW = new Date('2026-06-01')
const now = () => NOW

describe('AcceptInvitationUseCase', () => {
    it('joins the organization and reports the ids for the new session', async () => {
        const invitations = new InMemoryInvitationRepository([invitation()])
        const useCase = new AcceptInvitationUseCase(invitations, new InMemoryMembershipRepository(), now)

        const result = await useCase.execute({ token: 'token-1', userId: 'user-new' })

        expect(result.organizationId).toBe(ORG.id)
        expect(result.organizationIds).toContain(ORG.id)
        expect(invitations.accepted).toEqual([{ invitationId: 'invitation-1', userId: 'user-new' }])
    })

    it('rejects an unknown token', async () => {
        const useCase = new AcceptInvitationUseCase(
            new InMemoryInvitationRepository(),
            new InMemoryMembershipRepository(),
            now
        )

        await expect(useCase.execute({ token: 'nope', userId: 'user-new' })).rejects.toThrow(
            InvitationNotFoundError
        )
    })

    it('rejects an invitation already consumed', async () => {
        const invitations = new InMemoryInvitationRepository([
            invitation({ acceptedAt: new Date('2026-05-01') }),
        ])
        const useCase = new AcceptInvitationUseCase(invitations, new InMemoryMembershipRepository(), now)

        await expect(useCase.execute({ token: 'token-1', userId: 'user-new' })).rejects.toThrow(
            InvitationAlreadyAcceptedError
        )
    })

    it('rejects an expired invitation', async () => {
        const invitations = new InMemoryInvitationRepository([
            invitation({ expiresAt: new Date('2026-05-01') }),
        ])
        const useCase = new AcceptInvitationUseCase(invitations, new InMemoryMembershipRepository(), now)

        await expect(useCase.execute({ token: 'token-1', userId: 'user-new' })).rejects.toThrow(
            InvitationExpiredError
        )
    })
})

describe('GetInvitationUseCase', () => {
    function build(rows = [invitation()], members = new InMemoryMembershipRepository()) {
        return new GetInvitationUseCase(new InMemoryInvitationRepository(rows), members, now)
    }

    it('reports an acceptable invitation', async () => {
        const state = await build().execute('token-1', 'user-new')
        expect(state.status).toBe('acceptable')
    })

    it('reports a missing invitation', async () => {
        const state = await build([]).execute('token-1', 'user-new')
        expect(state.status).toBe('not-found')
    })

    it('reports an expired invitation', async () => {
        const state = await build([invitation({ expiresAt: new Date('2026-05-01') })]).execute(
            'token-1',
            'user-new'
        )
        expect(state.status).toBe('expired')
    })

    it('reports an invitation already accepted', async () => {
        const state = await build([invitation({ acceptedAt: NOW })]).execute('token-1', 'user-new')
        expect(state.status).toBe('already-accepted')
    })

    it('reports somebody who already belongs to the organization', async () => {
        const members = new InMemoryMembershipRepository([membership({ userId: 'user-new', role: 'member' })])
        const state = await build([invitation()], members).execute('token-1', 'user-new')
        expect(state.status).toBe('already-member')
    })
})
