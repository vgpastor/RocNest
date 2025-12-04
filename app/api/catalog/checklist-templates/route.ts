import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authService } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const user = await authService.getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const organizationId = user.currentOrganizationId
        if (!organizationId) {
            return NextResponse.json({ error: 'No hay organización seleccionada' }, { status: 400 })
        }

        // Check if user is admin
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: organizationId,
            },
        })

        if (!userOrg || userOrg.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const body = await request.json()
        const { categoryId, name, description, items, isActive } = body

        // Verify category exists and belongs to organization
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                organizationId,
                deletedAt: null,
            },
        })

        if (!category) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
        }

        // Create template
        const template = await prisma.categoryChecklistTemplate.create({
            data: {
                categoryId,
                name,
                description,
                items: items || [],
                isActive: isActive ?? true,
            },
        })

        return NextResponse.json(template, { status: 201 })
    } catch (error) {
        console.error('Error creating checklist template:', error)
        return NextResponse.json(
            { error: 'Error al crear la plantilla' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await authService.getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const organizationId = user.currentOrganizationId
        if (!organizationId) {
            return NextResponse.json({ error: 'No hay organización seleccionada' }, { status: 400 })
        }

        const { searchParams } = new URL(request.url)
        const categoryId = searchParams.get('categoryId')

        const templates = await prisma.categoryChecklistTemplate.findMany({
            where: {
                category: {
                    organizationId,
                    deletedAt: null,
                },
                ...(categoryId && { categoryId }),
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(templates)
    } catch (error) {
        console.error('Error fetching checklist templates:', error)
        return NextResponse.json(
            { error: 'Error al obtener las plantillas' },
            { status: 500 }
        )
    }
}
