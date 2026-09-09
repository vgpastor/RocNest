// Infrastructure Layer - Prisma adapter for IMembershipRepository

import { prisma } from '@/lib/prisma'

import type { IMembershipRepository } from '../domain/IMembershipRepository'
import type { Membership } from '../domain/types'
import { OrganizationRole } from '../domain/value-objects/OrganizationRole'

type MembershipRow = {
    id: string
    userId: string
    role: string
    joinedAt: Date
    user: { id: string; email: string; fullName: string | null }
}

const userSelection = { select: { id: true, email: true, fullName: true } }

function toDomain(row: MembershipRow): Membership {
    return {
        id: row.id,
        userId: row.userId,
        role: OrganizationRole.fromString(row.role),
        joinedAt: row.joinedAt,
        user: row.user,
    }
}

export class PrismaMembershipRepository implements IMembershipRepository {
    async findByUserAndOrganization(userId: string, organizationId: string): Promise<Membership | null> {
        const row = await prisma.userOrganization.findUnique({
            where: { userId_organizationId: { userId, organizationId } },
            include: { user: userSelection },
        })

        return row ? toDomain(row) : null
    }

    async findByOrganization(organizationId: string): Promise<Membership[]> {
        const rows = await prisma.userOrganization.findMany({
            where: { organizationId },
            include: { user: userSelection },
            orderBy: { joinedAt: 'desc' },
        })

        return rows.map(toDomain)
    }

    async listOrganizationIdsForUser(userId: string): Promise<string[]> {
        const rows = await prisma.userOrganization.findMany({
            where: { userId },
            select: { organizationId: true },
        })

        return rows.map((row) => row.organizationId)
    }

    async countAdministrators(organizationId: string): Promise<number> {
        return prisma.userOrganization.count({
            where: {
                organizationId,
                role: { in: [...OrganizationRole.administrativeValues()] },
            },
        })
    }

    async add(userId: string, organizationId: string, role: OrganizationRole): Promise<void> {
        await prisma.userOrganization.create({
            data: { userId, organizationId, role: role.value },
        })
    }

    async changeRole(userId: string, organizationId: string, role: OrganizationRole): Promise<Membership> {
        const row = await prisma.userOrganization.update({
            where: { userId_organizationId: { userId, organizationId } },
            data: { role: role.value },
            include: { user: userSelection },
        })

        return toDomain(row)
    }

    async remove(userId: string, organizationId: string): Promise<void> {
        await prisma.userOrganization.delete({
            where: { userId_organizationId: { userId, organizationId } },
        })
    }
}
