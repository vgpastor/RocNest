import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth/session'
import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'

export async function GET() {
    const sessionUser = await getSessionUser()
    const cookieOrgId = await OrganizationContextService.getCurrentOrganizationId()

    if (!sessionUser) {
        return NextResponse.json({ error: 'Not logged in' })
    }

    const user = await prisma.profile.findUnique({
        where: { id: sessionUser.userId },
        include: {
            userOrganizations: {
                include: {
                    organization: true
                }
            }
        }
    })

    // Get counts for all organizations the user belongs to
    const userOrgCounts = await Promise.all(user.userOrganizations.map(async (uo) => {
        const counts = await prisma.organization.findUnique({
            where: { id: uo.organizationId },
            select: {
                name: true,
                _count: {
                    select: {
                        userOrganizations: true,
                        categories: true,
                        items: true,
                        reservations: true
                    }
                }
            }
        })
        return {
            orgId: uo.organizationId,
            name: counts?.name,
            counts: counts?._count
        }
    }))

    return NextResponse.json({
        session: sessionUser,
        cookieOrgId,
        userOrgCounts,
        message: 'Check userOrgCounts to see if your organization has data'
    })
}
