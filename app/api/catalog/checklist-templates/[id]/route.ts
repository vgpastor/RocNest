import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authService } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authService.getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const organizationId = user.currentOrganizationId
        if (!organizationId) {
            return NextResponse.json({ error: 'No hay organización seleccionada' }, { status: 400 })
        }

        const { id } = await params

        const template = await prisma.categoryChecklistTemplate.findFirst({
            where: {
                id,
                category: {
                    organizationId,
                },
            },
            include: {
                category: true,
            },
        })

        if (!template) {
            return NextResponse.json({ error: 'Plantilla no encontrada' }, { status: 404 })
        }

        return NextResponse.json(template)
    } catch (error) {
        console.error('Error fetching checklist template:', error)
        return NextResponse.json(
            { error: 'Error al obtener la plantilla' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params
        const body = await request.json()

        // Verify template exists and belongs to organization
        const existingTemplate = await prisma.categoryChecklistTemplate.findFirst({
            where: {
                id,
                category: {
                    organizationId,
                },
            },
        })

        if (!existingTemplate) {
            return NextResponse.json({ error: 'Plantilla no encontrada' }, { status: 404 })
        }

        // Update template
        const updatedTemplate = await prisma.categoryChecklistTemplate.update({
            where: { id },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.items && { items: body.items }),
                ...(body.isActive !== undefined && { isActive: body.isActive }),
            },
        })

        return NextResponse.json(updatedTemplate)
    } catch (error) {
        console.error('Error updating checklist template:', error)
        return NextResponse.json(
            { error: 'Error al actualizar la plantilla' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params

        // Verify template exists and belongs to organization
        const existingTemplate = await prisma.categoryChecklistTemplate.findFirst({
            where: {
                id,
                category: {
                    organizationId,
                },
            },
        })

        if (!existingTemplate) {
            return NextResponse.json({ error: 'Plantilla no encontrada' }, { status: 404 })
        }

        // Delete template
        await prisma.categoryChecklistTemplate.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting checklist template:', error)
        return NextResponse.json(
            { error: 'Error al eliminar la plantilla' },
            { status: 500 }
        )
    }
}
