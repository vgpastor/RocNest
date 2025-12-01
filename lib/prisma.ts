// Global Prisma Client for Next.js with PostgreSQL Adapter (Prisma 7)
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Prevenir múltiples instancias en desarrollo (hot reload)
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
    pool: Pool | undefined
}

// Crear pool de PostgreSQL con adapter
function createPrismaClient() {
    const DATABASE_URL = process.env.DATABASE_URL || process.env.DIRECT_URL

    if (!DATABASE_URL) {
        throw new Error('DATABASE_URL not found in environment variables')
    }

    // Crear pool si no existe
    if (!globalForPrisma.pool) {
        globalForPrisma.pool = new Pool({
            connectionString: DATABASE_URL,
            ssl: false, // Desactivado para desarrollo local
            max: 10, // Número máximo de conexiones
        })
    }

    const adapter = new PrismaPg(globalForPrisma.pool)
    return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// En desarrollo, guardar en global para evitar hot reload issues
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Cleanup on process termination
if (typeof window === 'undefined') {
    process.on('beforeExit', async () => {
        await prisma.$disconnect()
        await globalForPrisma.pool?.end()
    })
}
