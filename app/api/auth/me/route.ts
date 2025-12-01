import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { getSession } from '@/lib/auth/session'
import type { AuthResponse, ErrorResponse } from '@/lib/auth/types'

// Setup Prisma
const pool = new Pool({
    connectionString: process.env.DATABASE_URL?.replace(/[?&]sslmode=require/g, ''),
    ssl: false,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function GET() {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'No autenticado' } as ErrorResponse,
                { status: 401 }
            )
        }

        const user = await prisma.profile.findUnique({
            where: { id: session.userId },
            include: {
                userOrganizations: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' } as ErrorResponse,
                { status: 404 }
            )
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                organizations: user.userOrganizations,
            },
        } as AuthResponse)
    } catch (error) {
        console.error('Get user error:', error)
        return NextResponse.json(
            { error: 'Error al obtener usuario' } as ErrorResponse,
            { status: 500 }
        )
    }
}
