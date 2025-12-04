import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth/session'
import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import ChecklistForm from '../ChecklistForm'

interface NewChecklistPageProps {
    searchParams: Promise<{ categoryId?: string }>
}

export default async function NewChecklistPage({ searchParams }: NewChecklistPageProps) {
    // Authentication is handled by middleware
    const sessionUser = await getSessionUser()

    // Get current organization
    const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId)

    if (!organizationId) {
        redirect('/organizations/select')
    }

    // Check if user is admin
    let isAdmin = false
    if (sessionUser) {
        const userOrg = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: sessionUser.userId,
                    organizationId
                }
            }
        })
        isAdmin = userOrg?.role === 'admin' || userOrg?.role === 'owner'
    }

    if (!isAdmin) {
        redirect('/catalog')
    }

    const params = await searchParams
    const categoryId = params.categoryId

    if (!categoryId) {
        redirect('/catalog/configuration/checklists')
    }

    // Fetch category
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            organizationId,
            deletedAt: null,
        },
    })

    if (!category) {
        notFound()
    }

    return (
        <ChecklistForm
            categoryId={category.id}
            categoryName={category.name}
        />
    )
}
