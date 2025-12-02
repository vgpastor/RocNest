// API Route: /api/organizations - Migrado a Prisma
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/organizations
 * Obtiene todas las organizaciones del usuario autenticado
 */
export async function GET() {
    try {
        const sessionUser = await getSessionUser()

        if (!sessionUser) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const userOrganizations = await prisma.userOrganization.findMany({
            where: {
                userId: sessionUser.userId
            },
            include: {
                organization: true
            },
            orderBy: {
                joinedAt: 'desc'
            }
        })

        const organizations = userOrganizations.map(uo => ({
            ...uo.organization,
            role: uo.role,
            joinedAt: uo.joinedAt
        }))

        return NextResponse.json({ organizations })
    } catch (error) {
        console.error('Error fetching organizations:', error)
        return NextResponse.json(
            { error: 'Error al obtener organizaciones' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/organizations
 * Crea una nueva organización y asigna al usuario como owner
 */
export async function POST(request: Request) {
    try {
        const sessionUser = await getSessionUser()

        if (!sessionUser) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const body = await request.json()
        const { name, slug, description } = body

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Nombre y slug son requeridos' },
                { status: 400 }
            )
        }

        const result = await prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: {
                    name,
                    slug,
                    description: description || null,
                    settings: {
                        allowMultipleCategories: true,
                        requireItemApproval: false,
                        maxItemsPerReservation: null
                    }
                }
            })

            await tx.userOrganization.create({
                data: {
                    userId: sessionUser.userId,
                    organizationId: organization.id,
                    role: 'owner'
                }
            })

            return organization
        })

        return NextResponse.json({ organization: result }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating organization:', error)

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Ya existe una organización con ese slug' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: 'Error al crear organización' },
            { status: 500 }
        )
    }
}
