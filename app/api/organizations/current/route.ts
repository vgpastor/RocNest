// API Route: /api/organizations/current - Get current organization
import { NextResponse } from 'next/server'

import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { getSessionUser } from '@/lib/auth/session'

/**
 * GET /api/organizations/current
 * Obtiene la organización activa actual del usuario
 */
export async function GET() {
    try {
        // Verificar autenticación
        const sessionUser = await getSessionUser()

        if (!sessionUser) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const organizationId = await OrganizationContextService.getCurrentOrganizationId(
            sessionUser.userId
        )

        return NextResponse.json({ organizationId })
    } catch (error) {
        console.error('Error getting current organization:', error)
        return NextResponse.json(
            { error: 'Error al obtener organización actual' },
            { status: 500 }
        )
    }
}
