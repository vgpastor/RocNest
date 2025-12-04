// Development seed entry point

import { PrismaClient } from '@prisma/client'
import { seedOrganizations } from './organizations'
import { seedUsers } from './users'
import { seedCategories } from './categories'
import { seedItems } from './items'
import { seedChecklistTemplates } from './checklist-templates'
import { seedReservations } from './reservations'
import { seedItemReviews } from './item-reviews'

export async function run(prisma: PrismaClient) {
    console.log('🚀 Running DEVELOPMENT seed with simplified data...\n')

    // 1. Organizations
    console.log('📂 Creating organizations...')
    const orgs = await seedOrganizations(prisma, 3)
    console.log(`✅ ${orgs.length} organizations created\n`)

    // 2. Users
    console.log('👥 Creating users...')
    const users = await seedUsers(prisma, orgs)
    console.log(`✅ ${users.length} users created\n`)

    // 3. Categories (7 main categories)
    console.log('📑 Creating categories...')
    const categories = await seedCategories(prisma, orgs)
    console.log(`✅ ${categories.length} categories created\n`)

    // 4. Checklist Templates
    console.log('📋 Creating checklist templates...')
    await seedChecklistTemplates(prisma, categories)
    console.log(`✅ Checklist templates created\n`)

    // 5. Items (Products and individual items)
    console.log('📦 Creating products and items...')
    const items = await seedItems(prisma, orgs, categories)
    console.log(`✅ ${items.length} items created\n`)

    // 6. Reservations (with varied states)
    console.log('📅 Creating reservations...')
    const reservations = await seedReservations(prisma, orgs, users, items)
    console.log(`✅ ${reservations.length} reservations created\n`)

    // 7. Item Reviews
    console.log('🔍 Creating item reviews...')
    await seedItemReviews(prisma, items, users, categories)
    console.log(`✅ Item reviews created\n`)

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 Development Data Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   📂 Organizations:     ${orgs.length}`)
    console.log(`   👥 Users:             ${users.length}`)
    console.log(`   📑 Categories:        ${categories.length}`)
    console.log(`   📦 Items:             ${items.length}`)
    console.log(`   📅 Reservations:      ${reservations.length}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n✨ Seed completed successfully!\n')
}
