import { describe, it, expect } from 'vitest'

import {
    InsufficientPermissionsError,
    LastAdministratorError,
    MemberNotFoundError,
    OwnerRoleProtectedError,
} from '../../../domain/errors/OrganizationErrors'
import { MembershipAuthorizationService } from '../../services/MembershipAuthorizationService'
import { ChangeMemberRoleUseCase } from '../ChangeMemberRoleUseCase'
import { ListMembersUseCase } from '../ListMembersUseCase'
import { RemoveMemberUseCase } from '../RemoveMemberUseCase'
import { SwitchOrganizationUseCase } from '../SwitchOrganizationUseCase'

import { InMemoryMembershipRepository, membership, ORG } from './testDoubles'

function build(rows: Array<{ userId: string; role: string }>) {
    const memberships = new InMemoryMembershipRepository(rows.map(membership))
    const authorization = new MembershipAuthorizationService(memberships)

    return {
        memberships,
        list: new ListMembersUseCase(memberships, authorization),
        changeRole: new ChangeMemberRoleUseCase(memberships, authorization),
        remove: new RemoveMemberUseCase(memberships, authorization),
        switchOrganization: new SwitchOrganizationUseCase(memberships),
    }
}

const TWO_ADMINS = [
    { userId: 'user-1', role: 'admin' },
    { userId: 'user-2', role: 'admin' },
]

describe('ListMembersUseCase', () => {
    it('lists members for an owner', async () => {
        const subject = build([{ userId: 'user-1', role: 'owner' }])
        await expect(subject.list.execute('user-1', ORG.id)).resolves.toHaveLength(1)
    })

    it('rejects a plain member', async () => {
        const subject = build([{ userId: 'user-1', role: 'member' }])
        await expect(subject.list.execute('user-1', ORG.id)).rejects.toThrow(InsufficientPermissionsError)
    })
})

describe('ChangeMemberRoleUseCase', () => {
    it('changes the role when another administrator remains', async () => {
        const subject = build(TWO_ADMINS)

        const updated = await subject.changeRole.execute({
            requesterId: 'user-1',
            organizationId: ORG.id,
            targetUserId: 'user-2',
            role: 'member',
        })

        expect(updated.role.value).toBe('member')
    })

    it('refuses to demote the last administrator', async () => {
        const subject = build([
            { userId: 'user-1', role: 'admin' },
            { userId: 'user-2', role: 'member' },
        ])

        await expect(
            subject.changeRole.execute({
                requesterId: 'user-1',
                organizationId: ORG.id,
                targetUserId: 'user-1',
                role: 'member',
            })
        ).rejects.toThrow(LastAdministratorError)
    })

    it('counts owners as administrators', async () => {
        const subject = build([
            { userId: 'user-1', role: 'owner' },
            { userId: 'user-2', role: 'admin' },
        ])

        await expect(
            subject.changeRole.execute({
                requesterId: 'user-1',
                organizationId: ORG.id,
                targetUserId: 'user-2',
                role: 'member',
            })
        ).resolves.toBeDefined()
    })

    it('fails when the target is not a member', async () => {
        const subject = build(TWO_ADMINS)

        await expect(
            subject.changeRole.execute({
                requesterId: 'user-1',
                organizationId: ORG.id,
                targetUserId: 'stranger',
                role: 'member',
            })
        ).rejects.toThrow(MemberNotFoundError)
    })
})

describe('proteccion del propietario', () => {
    const OWNER_AND_ADMINS = [
        { userId: 'user-owner', role: 'owner' },
        { userId: 'user-1', role: 'admin' },
        { userId: 'user-2', role: 'admin' },
    ]

    it('impide que un admin degrade al owner', async () => {
        const subject = build(OWNER_AND_ADMINS)

        await expect(
            subject.changeRole.execute({
                requesterId: 'user-1',
                organizationId: ORG.id,
                targetUserId: 'user-owner',
                role: 'member',
            })
        ).rejects.toThrow(OwnerRoleProtectedError)
    })

    it('impide que un admin expulse al owner', async () => {
        const subject = build(OWNER_AND_ADMINS)

        await expect(
            subject.remove.execute({
                requesterId: 'user-1',
                organizationId: ORG.id,
                targetUserId: 'user-owner',
            })
        ).rejects.toThrow(OwnerRoleProtectedError)

        expect(subject.memberships.all.map((row) => row.userId)).toContain('user-owner')
    })

    it('permite que otro owner si lo haga', async () => {
        const subject = build([
            { userId: 'user-owner', role: 'owner' },
            { userId: 'user-owner-2', role: 'owner' },
        ])

        await expect(
            subject.changeRole.execute({
                requesterId: 'user-owner-2',
                organizationId: ORG.id,
                targetUserId: 'user-owner',
                role: 'member',
            })
        ).resolves.toBeDefined()
    })

    it('sigue permitiendo actuar sobre admins normales', async () => {
        const subject = build(OWNER_AND_ADMINS)

        await expect(
            subject.changeRole.execute({
                requesterId: 'user-1',
                organizationId: ORG.id,
                targetUserId: 'user-2',
                role: 'member',
            })
        ).resolves.toBeDefined()
    })
})

describe('RemoveMemberUseCase', () => {
    it('removes a member', async () => {
        const subject = build([
            { userId: 'user-1', role: 'admin' },
            { userId: 'user-2', role: 'member' },
        ])

        await subject.remove.execute({
            requesterId: 'user-1',
            organizationId: ORG.id,
            targetUserId: 'user-2',
        })

        expect(subject.memberships.all.map((row) => row.userId)).toEqual(['user-1'])
    })

    it('refuses to remove the last administrator', async () => {
        const subject = build([{ userId: 'user-1', role: 'admin' }])

        await expect(
            subject.remove.execute({
                requesterId: 'user-1',
                organizationId: ORG.id,
                targetUserId: 'user-1',
            })
        ).rejects.toThrow(LastAdministratorError)
    })
})

describe('SwitchOrganizationUseCase', () => {
    it('returns every organization so the session token stays in sync', async () => {
        const subject = build([{ userId: 'user-1', role: 'member' }])

        const result = await subject.switchOrganization.execute('user-1', ORG.id)

        expect(result.organizationIds).toContain(ORG.id)
    })

    it('rejects an organization the user does not belong to', async () => {
        const subject = build([{ userId: 'user-1', role: 'member' }])
        await expect(subject.switchOrganization.execute('stranger', ORG.id)).rejects.toThrow()
    })
})
