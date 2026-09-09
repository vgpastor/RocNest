// In-memory adapters for the organization ports.
// The use cases only know the ports, so the rules can be tested without a database.

import type { IInvitationRepository } from '../../../domain/IInvitationRepository'
import type { IMembershipRepository } from '../../../domain/IMembershipRepository'
import type { EmailMessage, IEmailSender } from '../../../domain/services/IEmailSender'
import type { Invitation, Membership, NewInvitation } from '../../../domain/types'
import { OrganizationRole } from '../../../domain/value-objects/OrganizationRole'

export const ORG = { id: 'org-1', name: 'ICEM Pallars' }
export const INVITER = { id: 'user-admin', email: 'admin@icem.test', fullName: 'Jordi' }

export interface MembershipSeed {
    userId: string
    role: string
    id?: string
    joinedAt?: Date
}

export function membership(seed: MembershipSeed): Membership {
    return {
        id: seed.id ?? `membership-${seed.userId}`,
        userId: seed.userId,
        role: OrganizationRole.fromString(seed.role),
        joinedAt: seed.joinedAt ?? new Date('2026-01-01'),
        user: { id: seed.userId, email: `${seed.userId}@icem.test`, fullName: null },
    }
}

export class InMemoryMembershipRepository implements IMembershipRepository {
    constructor(private rows: Membership[] = []) {}

    async findByUserAndOrganization(userId: string): Promise<Membership | null> {
        return this.rows.find((row) => row.userId === userId) ?? null
    }

    async findByOrganization(): Promise<Membership[]> {
        return [...this.rows]
    }

    async listOrganizationIdsForUser(): Promise<string[]> {
        return [ORG.id]
    }

    async countAdministrators(): Promise<number> {
        return this.rows.filter((row) => row.role.isAdministrative()).length
    }

    async add(userId: string, organizationId: string, role: OrganizationRole): Promise<void> {
        this.rows.push(membership({ userId, role: role.value }))
    }

    async changeRole(userId: string, organizationId: string, role: OrganizationRole): Promise<Membership> {
        const row = this.rows.find((candidate) => candidate.userId === userId)!
        const updated = { ...row, role }
        this.rows = this.rows.map((candidate) => (candidate.userId === userId ? updated : candidate))
        return updated
    }

    async remove(userId: string): Promise<void> {
        this.rows = this.rows.filter((row) => row.userId !== userId)
    }

    get all(): Membership[] {
        return this.rows
    }
}

export function invitation(overrides: Partial<Invitation> = {}): Invitation {
    return {
        id: 'invitation-1',
        token: 'token-1',
        email: 'nuevo@icem.test',
        role: OrganizationRole.fromString('admin'),
        organization: ORG,
        inviter: INVITER,
        expiresAt: new Date('2026-12-31'),
        acceptedAt: null,
        ...overrides,
    }
}

export class InMemoryInvitationRepository implements IInvitationRepository {
    accepted: Array<{ invitationId: string; userId: string }> = []

    constructor(private rows: Invitation[] = []) {}

    async create(data: NewInvitation): Promise<Invitation> {
        const created = invitation({
            id: `invitation-${this.rows.length + 1}`,
            token: `token-${this.rows.length + 1}`,
            email: data.email,
            role: data.role,
            expiresAt: data.expiresAt,
        })
        this.rows.push(created)
        return created
    }

    async findByToken(token: string): Promise<Invitation | null> {
        return this.rows.find((row) => row.token === token) ?? null
    }

    async expirePendingFor(organizationId: string, email: string): Promise<number> {
        const now = new Date()
        const pending = this.rows.filter(
            (row) => row.email === email && !row.acceptedAt && row.expiresAt > now
        )

        this.rows = this.rows.map((row) =>
            pending.includes(row) ? { ...row, expiresAt: now } : row
        )

        return pending.length
    }

    async acceptAndJoin(target: Invitation, userId: string): Promise<void> {
        this.accepted.push({ invitationId: target.id, userId })
        this.rows = this.rows.map((row) =>
            row.id === target.id ? { ...row, acceptedAt: new Date() } : row
        )
    }

    get all(): Invitation[] {
        return this.rows
    }
}

export class FakeEmailSender implements IEmailSender {
    sent: EmailMessage[] = []
    shouldFail = false

    async send(message: EmailMessage): Promise<void> {
        if (this.shouldFail) {
            throw new Error('SES unavailable')
        }
        this.sent.push(message)
    }
}
