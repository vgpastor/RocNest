// API Route: PATCH /api/organizations/[orgId]
// Update organization details
import { NextResponse } from 'next/server'

import { authService, AuthenticationError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const user = await authService.requireAuth()

    const { orgId } = await params
    const body = await request.json()
    const { name, slug, description, logoUrl, settings } = body

    // Verify user is admin or owner
    const membership = await prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: user.userId,
          organizationId: orgId
        }
      }
    })

    if (!membership || membership.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Build update data
    const updateData: Record<string, unknown> = {}

    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl
    if (settings !== undefined) updateData.settings = settings

    // Update organization
    const updatedOrganization = await prisma.organization.update({
      where: {
        id: orgId
      },
      data: updateData
    })

    return NextResponse.json({ organization: updatedOrganization })
  } catch (error: unknown) {
    // Handle authentication error
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    console.error('Error updating organization:', error)

    // Handle unique constraint violation (duplicate name/slug)
    if (error instanceof Object && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una organización con ese nombre o slug' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar organización' },
      { status: 500 }
    )
  }
}
