import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth/password'
import { createSession, setSessionCookie } from '@/lib/auth/session'
import type { LoginRequest, AuthResponse, ErrorResponse } from '@/lib/auth/types'

export async function POST(request: NextRequest) {
    try {
        const body: LoginRequest = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' } as ErrorResponse,
                { status: 400 }
            )
        }

        // Find user by email
        const user = await prisma.profile.findUnique({
            where: { email: email.toLowerCase() },
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

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' } as ErrorResponse,
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' } as ErrorResponse,
                { status: 401 }
            )
        }

        // Create session with organization IDs
        const organizationIds = user.userOrganizations.map(uo => uo.organization.id)
        const token = await createSession(user.id, user.email, organizationIds)

        // Prepare response
        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                organizations: user.userOrganizations,
            },
        } as AuthResponse)

        // Set session cookie
        setSessionCookie(response, token)

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Error al iniciar sesión' } as ErrorResponse,
            { status: 500 }
        )
    }
}
