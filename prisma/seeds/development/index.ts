// Development seed entry point

import { PrismaClient } from '@prisma/client'
import { seedOrganizations } from './organizations'
import { seedUsers } from './users'
import { seedCategories } from './categories'
import { seedItems } from './items'
import { seedReservations } from './reservations'

export async function run(prisma: PrismaClient) {
    console.log('🚀 Running DEVELOPMENT seed...\n')

    // 1. Organizations
    console.log('📂 Creating organizations...')
    const orgs = await seedOrganizations(prisma, 3)
    console.log(`✅ ${orgs.length} organizations created\n`)

    // 2. Users
    console.log('👥 Creating users...')
    const users = await seedUsers(prisma, orgs)
    console.log(`✅ ${users.length} users created\n`)

    // 3. Categories
    console.log('📑 Creating categories...')
    const categories = await seedCategories(prisma, orgs)
    console.log(`✅ ${categories.length} categories created\n`)

    // 4. Items
    console.log('📦 Creating items...')
    const items = await seedItems(prisma, orgs, categories)
    console.log(`✅ ${items.length} items created\n`)

    // 5. Reservations
    console.log('📅 Creating reservations...')
    const reservations = await seedReservations(prisma, orgs, users, items)
    console.log(`✅ ${reservations.length} reservations created\n`)

    // Summary
    console.log('📊 Development Data Summary:')
    console.log(`   • ${orgs.length} Organizations`)
    console.log(`   • ${users.length} Users`)
    console.log(`   • ${categories.length} Categories`)
    console.log(`   • ${items.length} Items`)
    console.log(`   • ${reservations.length} Reservations`)
}
