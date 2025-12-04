import { randomUUID } from 'crypto'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'


import { hashPassword, validatePassword } from '@/lib/auth/password'
import { createSession, setSessionCookie } from '@/lib/auth/session'
import type { RegisterRequest, AuthResponse, ErrorResponse } from '@/lib/auth/types'

// Setup Prisma
const pool = new Pool({
    connectionString: process.env.DATABASE_URL?.replace(/[?&]sslmode=require/g, ''),
    ssl: false,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function POST(request: NextRequest) {
    try {
        const body: RegisterRequest = await request.json()
        const { email, password, fullName } = body

        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' } as ErrorResponse,
                { status: 400 }
            )
        }

        // Validate password
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { error: passwordValidation.error || 'Contraseña inválida' } as ErrorResponse,
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.profile.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email ya está registrado' } as ErrorResponse,
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user
        const user = await prisma.profile.create({
            data: {
                id: randomUUID(),
                email: email.toLowerCase(),
                password: hashedPassword,
                fullName,
            },
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

        // Create session (usuario nuevo sin organizaciones)
        const token = await createSession(user.id, user.email, [])

        // Prepare response
        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                organizations: user.userOrganizations,
            },
            message: 'Cuenta creada exitosamente',
        } as AuthResponse)

        // Set session cookie
        setSessionCookie(response, token)

        return response
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json(
            { error: 'Error al crear la cuenta' } as ErrorResponse,
            { status: 500 }
        )
    }
}
