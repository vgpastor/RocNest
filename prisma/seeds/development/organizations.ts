// Development seed - Organizations

import { PrismaClient } from '@prisma/client'

import { generateOrganizationData } from '../shared/factories'
import type { SeedOrganization } from '../shared/types'

export async function seedOrganizations(
    prisma: PrismaClient,
    count: number = 7
): Promise<SeedOrganization[]> {
    const organizations: SeedOrganization[] = []

    for (let i = 0; i < count; i++) {
        const orgData = generateOrganizationData()

        const org = await prisma.organization.upsert({
            where: { slug: orgData.slug },
            update: {},
            create: orgData,
        })

        organizations.push(org)
    }

    return organizations
}
