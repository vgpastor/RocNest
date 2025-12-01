// Prisma Seed with Environment Support
// Usage:
//   npm run db:seed:dev       - Development seed (abundant data)
//   npm run db:seed:test      - Test seed (minimal data)
//   npm run db:seed:dev:clear - Development seed with clear

// Load environment variables FIRST
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'

// Load .env and .env.local
dotenv.config()
const env = dotenv.config({ path: '.env.local' })
dotenvExpand.expand(env)

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { parseArgs } from 'node:util'
import * as devSeeds from './seeds/development'
import * as testSeeds from './seeds/test'

// ============================================
// SETUP PRISMA
// ============================================

let DATABASE_URL = process.env.DATABASE_URL || process.env.DIRECT_URL

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL not found in environment variables')
}

// Para Supabase pooler, remover sslmode=require
DATABASE_URL = DATABASE_URL.replace(/[?&]sslmode=require/g, '')

// Crear pool de conexiones PostgreSQL
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: false, // Desactivar SSL para testing local
})
const adapter = new PrismaPg(pool)

// Crear Prisma Client con adapter
const prisma = new PrismaClient({ adapter })

// ============================================
// PARSE ARGUMENTS
// ============================================

const options = {
    environment: {
        type: 'string',
        short: 'e',
        default: 'development',
    },
    clear: {
        type: 'boolean',
        short: 'c',
        default: false,
    },
} as const

// ============================================
// CLEAR DATA
// ============================================

async function clearData() {
    console.log('🧹 Clearing existing data...\n')

    // Orden importante por las foreign keys
    await prisma.reservationActivity.deleteMany()
    await prisma.reservationExtension.deleteMany()
    await prisma.itemInspection.deleteMany()
    await prisma.reservationItem.deleteMany()
    await prisma.reservationUser.deleteMany()
    await prisma.reservationLocation.deleteMany()
    await prisma.reservation.deleteMany()
    await prisma.item.deleteMany()
    await prisma.category.deleteMany()
    await prisma.userOrganization.deleteMany()
    await prisma.profile.deleteMany()
    await prisma.organization.deleteMany()

    console.log('✅ Data cleared\n')
}

// ============================================
// MAIN
// ============================================

async function main() {
    const { values } = parseArgs({ options })
    const environment = values.environment || 'development'

    console.log('╔══════════════════════════════════════╗')
    console.log('║    Prisma Seed - RocNest             ║')
    console.log('╚══════════════════════════════════════╝\n')
    console.log(`Environment: ${environment}`)
    console.log(`Clear data:  ${values.clear ? 'Yes' : 'No'}\n`)

    // Limpiar datos si se solicita
    if (values.clear) {
        await clearData()
    }

    // Ejecutar seed según environment
    const startTime = Date.now()

    switch (environment) {
        case 'development':
        case 'dev':
            await devSeeds.run(prisma)
            break

        case 'test':
            await testSeeds.run(prisma)
            break

        default:
            console.warn(`⚠️  Unknown environment: ${environment}`)
            console.log('Available environments: development, test')
            process.exit(1)
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log(`\n╔══════════════════════════════════════╗`)
    console.log(`║  ✅ Seed completed in ${duration}s       ║`)
    console.log(`╚══════════════════════════════════════╝\n`)
}

// ============================================
// EXECUTION
// ============================================

main()
    .catch((e) => {
        console.error('\n❌ Error during seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await pool.end()
        await prisma.$disconnect()
    })
