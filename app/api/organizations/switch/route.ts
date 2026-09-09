// API Route: POST /api/organizations/switch
// Changes the active organization. Reading it lives in /api/organizations/current.
import { NextResponse } from 'next/server'

import { organizationsModule } from '@/app/(app)/organizations/infrastructure/container'
import { domainErrorResponse } from '@/app/(app)/organizations/infrastructure/http/domainErrorResponse'
import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { authService } from '@/lib/auth'
import { refreshSessionCookie } from '@/lib/auth/session'

export async function POST(request: Request) {
    try {
        const user = await authService.requireAuth()
        const body = await request.json()
        const { organizationId } = body

        if (!organizationId) {
            return NextResponse.json({ error: 'organizationId es requerido' }, { status: 400 })
        }

        const result = await organizationsModule().switchOrganization.execute(
            user.userId,
            organizationId
        )

        await OrganizationContextService.setCurrentOrganizationId(result.organizationId)

        // The middleware validates the active organization against the IDs baked into
        // the token; a stale token would loop the user back to /organizations/select.
        await refreshSessionCookie(user.userId, user.email, result.organizationIds)

        return NextResponse.json({ success: true, organizationId: result.organizationId })
    } catch (error) {
        return domainErrorResponse(error, 'Error al cambiar organización')
    }
}
