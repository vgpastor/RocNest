// Infrastructure Layer - Prisma adapter for IInvitationRepository

import { prisma } from '@/lib/prisma'

import type { IInvitationRepository } from '../domain/IInvitationRepository'
import type { Invitation, NewInvitation } from '../domain/types'
import { OrganizationRole } from '../domain/value-objects/OrganizationRole'

const relations = {
    organization: { select: { id: true, name: true } },
    inviter: { select: { id: true, email: true, fullName: true } },
} as const

type InvitationRow = {
    id: string
    token: string
    email: string
    role: string
    expiresAt: Date
    acceptedAt: Date | null
    organizationId: string
    organization: { id: string; name: string }
    inviter: { id: string; email: string; fullName: string | null }
}

function toDomain(row: InvitationRow): Invitation {
    return {
        id: row.id,
        token: row.token,
        email: row.email,
        role: OrganizationRole.fromString(row.role),
        organization: row.organization,
        inviter: row.inviter,
        expiresAt: row.expiresAt,
        acceptedAt: row.acceptedAt,
    }
}

export class PrismaInvitationRepository implements IInvitationRepository {
    async create(invitation: NewInvitation): Promise<Invitation> {
        const row = await prisma.organizationInvitation.create({
            data: {
                organizationId: invitation.organizationId,
                email: invitation.email,
                role: invitation.role.value,
                invitedBy: invitation.invitedBy,
                expiresAt: invitation.expiresAt,
            },
            include: relations,
        })

        return toDomain(row)
    }

    async findByToken(token: string): Promise<Invitation | null> {
        const row = await prisma.organizationInvitation.findUnique({
            where: { token },
            include: relations,
        })

        return row ? toDomain(row) : null
    }

    async acceptAndJoin(invitation: Invitation, userId: string): Promise<void> {
        await prisma.$transaction(async (tx) => {
            // upsert: a double submit must not blow up with a unique constraint violation
            await tx.userOrganization.upsert({
                where: {
                    userId_organizationId: {
                        userId,
                        organizationId: invitation.organization.id,
                    },
                },
                update: {},
                create: {
                    userId,
                    organizationId: invitation.organization.id,
                    role: invitation.role.value,
                },
            })

            await tx.organizationInvitation.update({
                where: { id: invitation.id },
                data: { acceptedAt: new Date() },
            })
        })
    }

    async expirePendingFor(organizationId: string, email: string): Promise<number> {
        const now = new Date()

        // Expiring rather than deleting keeps the audit trail and makes the stale link
        // report "Invitación expirada", which is exactly what happened to it.
        const { count } = await prisma.organizationInvitation.updateMany({
            where: {
                organizationId,
                email,
                acceptedAt: null,
                expiresAt: { gt: now },
            },
            data: { expiresAt: now },
        })

        return count
    }
}
