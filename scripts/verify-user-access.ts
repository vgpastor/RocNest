import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    const email = 'user1@federacion-de-escalada-andalucia.com'

    console.log(`Checking access for user: ${email}`)

    const user = await prisma.profile.findUnique({
        where: { email },
        include: {
            userOrganizations: {
                include: {
                    organization: true
                }
            }
        }
    })

    if (!user) {
        console.error('User not found!')
        return
    }

    console.log(`User ID: ${user.id}`)
    console.log(`User Role (Global): ${user.role}`)

    if (user.userOrganizations.length === 0) {
        console.warn('User is not a member of any organization.')
    } else {
        console.log('Organizations:')
        user.userOrganizations.forEach(uo => {
            console.log(`- Organization: ${uo.organization.name} (${uo.organization.id})`)
            console.log(`  Role: ${uo.role}`)
            console.log(`  Slug: ${uo.organization.slug}`)
        })
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
