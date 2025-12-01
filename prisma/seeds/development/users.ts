// Development seed - Users

import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { generateUserData, randomInt } from '../shared/factories'
import type { SeedOrganization, SeedUser, UserRole } from '../shared/types'

// Contraseña fija para todos los usuarios de desarrollo
const FIXED_PASSWORD = '12341234'

export async function seedUsers(
    prisma: PrismaClient,
    organizations: SeedOrganization[]
): Promise<SeedUser[]> {
    const users: SeedUser[] = []

    for (const org of organizations) {
        const userCount = randomInt(10, 20)

        // 1 owner
        const ownerData = generateUserData(org.id, 'owner')
        const owner = await createUserWithAuth(prisma, ownerData, org.id, 'owner')
        users.push({ ...ownerData, id: owner.id })

        // 2-3 admins
        const adminCount = randomInt(2, 3)
        for (let i = 0; i < adminCount; i++) {
            const adminData = generateUserData(org.id, 'admin')
            const admin = await createUserWithAuth(prisma, adminData, org.id, 'admin')
            users.push({ ...adminData, id: admin.id })
        }

        // Resto members
        const memberCount = userCount - 1 - adminCount
        for (let i = 0; i < memberCount; i++) {
            const memberData = generateUserData(org.id, 'member')
            const member = await createUserWithAuth(prisma, memberData, org.id, 'member')
            users.push({ ...memberData, id: member.id })
        }
    }

    return users
}

async function createUserWithAuth(
    prisma: PrismaClient,
    userData: { email: string; fullName: string },
    organizationId: string,
    role: UserRole
) {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(FIXED_PASSWORD, 10)

    // Crear usuario en la base de datos con contraseña hasheada
    const profile = await prisma.profile.upsert({
        where: { email: userData.email },
        update: {
            fullName: userData.fullName,
            password: hashedPassword,
        },
        create: {
            id: randomUUID(),
            email: userData.email,
            password: hashedPassword,
            fullName: userData.fullName,
            userOrganizations: {
                create: {
                    organizationId,
                    role,
                },
            },
        },
    })

    return profile
}
