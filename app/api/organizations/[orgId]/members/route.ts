// API Route: /api/organizations/[orgId]/members
// Thin controller: parses the request, delegates to the use case, serializes the result.
import { NextResponse } from 'next/server'

import { toInvitationDto, toMemberDto } from '@/app/(app)/organizations/application/dtos/MemberDto'
import { organizationsModule } from '@/app/(app)/organizations/infrastructure/container'
import { domainErrorResponse } from '@/app/(app)/organizations/infrastructure/http/domainErrorResponse'
import { resolveAppUrl } from '@/lib/app-url'
import { authService } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
    try {
        const user = await authService.requireAuth()
        const { orgId } = await params

        const members = await organizationsModule().listMembers.execute(user.userId, orgId)

        return NextResponse.json({ members: members.map(toMemberDto) })
    } catch (error) {
        return domainErrorResponse(error, 'Error al obtener miembros')
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
    try {
        const user = await authService.requireAuth()
        const { orgId } = await params
        const body = await request.json()

        const result = await organizationsModule().inviteMember.execute({
            organizationId: orgId,
            invitedBy: user.userId,
            email: typeof body.email === 'string' ? body.email : '',
            role: typeof body.role === 'string' ? body.role : 'member',
            appUrl: resolveAppUrl(request),
        })

        return NextResponse.json(
            {
                invitation: toInvitationDto(result.invitation),
                invitationLink: result.invitationLink,
                emailSent: result.emailSent,
            },
            { status: 201 }
        )
    } catch (error) {
        return domainErrorResponse(error, 'Error al crear invitación')
    }
}
