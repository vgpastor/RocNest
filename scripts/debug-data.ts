
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    console.log('--- Debugging Data ---')

    const orgs = await prisma.organization.findMany({
        include: {
            _count: {
                select: {
                    users: true,
                    categories: true,
                    items: true,
                    reservations: true
                }
            }
        }
    })

    console.log(`Found ${orgs.length} organizations:`)
    for (const org of orgs) {
        console.log(`- [${org.id}] ${org.name} (${org.slug})`)
        console.log(`  Users: ${org._count.users}`)
        console.log(`  Categories: ${org._count.categories}`)
        console.log(`  Items: ${org._count.items}`)
        console.log(`  Reservations: ${org._count.reservations}`)
    }

    const users = await prisma.profile.findMany({
        include: {
            userOrganizations: {
                include: {
                    organization: true
                }
            }
        }
    })

    console.log(`\nFound ${users.length} users.`)
    const myUser = users.find(u => u.email.startsWith('user1@'))
    if (myUser) {
        console.log(`\nUser1 details:`)
        console.log(`ID: ${myUser.id}`)
        console.log(`Email: ${myUser.email}`)
        console.log(`Memberships:`)
        myUser.userOrganizations.forEach(uo => {
            console.log(`  - ${uo.organization.name} (${uo.role}) [${uo.organizationId}]`)
        })
    } else {
        console.log('\nUser1 not found!')
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
