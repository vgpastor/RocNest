// Script para verificar usuarios y contraseñas en la base de datos
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import { Pool } from 'pg'

// Load environment variables
dotenv.config()
const env = dotenv.config({ path: '.env.local' })
dotenvExpand.expand(env)

let DATABASE_URL = process.env.DATABASE_URL || process.env.DIRECT_URL
if (!DATABASE_URL) {
    throw new Error('DATABASE_URL not found')
}
DATABASE_URL = DATABASE_URL.replace(/[?&]sslmode=require/g, '')

const pool = new Pool({ connectionString: DATABASE_URL, ssl: false })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const FIXED_PASSWORD = '12341234'

async function checkUsers() {
    try {
        console.log('🔍 Checking users in database...\n')

        // Get first 3 users with their organizations
        const users = await prisma.profile.findMany({
            take: 10,
            include: {
                userOrganizations: {
                    include: {
                        organization: {
                            select: {
                                slug: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                email: 'asc',
            },
        })

        if (users.length === 0) {
            console.log('❌ No users found in database')
            return
        }

        console.log(`Found ${users.length} users:\n`)

        for (const user of users) {
            const org = user.userOrganizations[0]
            console.log(`\n📧 Email: ${user.email}`)
            console.log(`   Name: ${user.fullName}`)
            console.log(`   Org: ${org?.organization.slug || 'none'}`)
            console.log(`   Has password: ${user.password ? '✅ YES' : '❌ NO'}`)

            if (user.password) {
                // Test password verification
                const isValid = await bcrypt.compare(FIXED_PASSWORD, user.password)
                console.log(`   Password "${FIXED_PASSWORD}" works: ${isValid ? '✅ YES' : '❌ NO'}`)

                if (!isValid) {
                    console.log(`   ⚠️  Hash in DB: ${user.password.substring(0, 30)}...`)
                }
            }
        }

        console.log('\n✅ Verification complete')
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await pool.end()
        await prisma.$disconnect()
    }
}

checkUsers()
