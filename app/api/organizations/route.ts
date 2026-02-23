// API Route: /api/organizations - Migrado a Prisma
import { NextResponse } from 'next/server'

import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { applyOrganizationTemplate, type TemplateType } from '@/prisma/seeds/shared/templates'

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
        const { name, slug, description, template } = body

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Nombre y slug son requeridos' },
                { status: 400 }
            )
        }

        // Verificar si ya existe antes de crear
        const existingByName = await prisma.organization.findUnique({
            where: { name }
        })
        
        const existingBySlug = await prisma.organization.findUnique({
            where: { slug }
        })
        
        if (existingByName) {
            return NextResponse.json(
                { error: 'Ya existe una organización con ese nombre' },
                { status: 409 }
            )
        }
        
        if (existingBySlug) {
            return NextResponse.json(
                { error: 'Ya existe una organización con ese slug' },
                { status: 409 }
            )
        }

        // Fase 1: Transacción crítica - Crear organización y asignar usuario
        const organization = await prisma.$transaction(async (tx) => {
            const newOrg = await tx.organization.create({
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
                    organizationId: newOrg.id,
                    role: 'admin'
                }
            })

            return newOrg
        })

        // Fase 2: Aplicar template fuera de la transacción crítica
        if (template && template !== 'empty') {
            try {
                await applyOrganizationTemplate(prisma, organization.id, template as TemplateType)
            } catch (templateError) {
                console.error(`Error applying template "${template}":`, templateError)
                // La organización ya está creada, informar del error del template pero no fallar
                return NextResponse.json({
                    organization,
                    warning: `Organización creada pero hubo un error aplicando el template: ${templateError instanceof Error ? templateError.message : 'Error desconocido'}`
                }, { status: 201 })
            }
        }

        return NextResponse.json({ organization }, { status: 201 })
    } catch (error: unknown) {
        console.error('Error creating organization:', error)
        
        const prismaError = error as { code?: string; meta?: { target?: string | string[] } }

        // P2002: Unique constraint violation
        if (prismaError.code === 'P2002') {
            // Extraer el campo que causó el conflicto
            const target = prismaError.meta?.target
            if (target) {
                const targetStr = Array.isArray(target) ? target.join(',') : String(target)
                if (targetStr.includes('slug')) {
                    return NextResponse.json(
                        { error: 'Ya existe una organización con ese slug' },
                        { status: 409 }
                    )
                } else if (targetStr.includes('name')) {
                    return NextResponse.json(
                        { error: 'Ya existe una organización con ese nombre' },
                        { status: 409 }
                    )
                }
            }
            
            // Fallback si no podemos determinar el campo
            return NextResponse.json(
                { error: 'Ya existe una organización con esos datos (nombre o slug)' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: 'Error al crear organización' },
            { status: 500 }
        )
    }
}
