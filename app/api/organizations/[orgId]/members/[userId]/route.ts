// API Route: /api/organizations/[orgId]/members/[userId]
// Thin controller: parses the request, delegates to the use case, serializes the result.
import { NextResponse } from 'next/server'

import { toMemberDto } from '@/app/(app)/organizations/application/dtos/MemberDto'
import { organizationsModule } from '@/app/(app)/organizations/infrastructure/container'
import { domainErrorResponse } from '@/app/(app)/organizations/infrastructure/http/domainErrorResponse'
import { authService } from '@/lib/auth'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
    try {
        const user = await authService.requireAuth()
        const { orgId, userId } = await params
        const body = await request.json()

        const member = await organizationsModule().changeMemberRole.execute({
            requesterId: user.userId,
            organizationId: orgId,
            targetUserId: userId,
            role: typeof body.role === 'string' ? body.role : '',
        })

        return NextResponse.json({ member: toMemberDto(member) })
    } catch (error) {
        return domainErrorResponse(error, 'Error al actualizar rol')
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
    try {
        const user = await authService.requireAuth()
        const { orgId, userId } = await params

        await organizationsModule().removeMember.execute({
            requesterId: user.userId,
            organizationId: orgId,
            targetUserId: userId,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return domainErrorResponse(error, 'Error al remover miembro')
    }
}
