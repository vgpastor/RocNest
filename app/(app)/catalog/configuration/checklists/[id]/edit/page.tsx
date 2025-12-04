import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth/session'
import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import ChecklistForm from '../../ChecklistForm'

interface EditChecklistPageProps {
    params: Promise<{ id: string }>
}

export default async function EditChecklistPage({ params }: EditChecklistPageProps) {
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

    const { id } = await params

    // Fetch template
    const template = await prisma.categoryChecklistTemplate.findFirst({
        where: {
            id,
            category: {
                organizationId,
                deletedAt: null,
            },
        },
        include: {
            category: true,
        },
    })

    if (!template) {
        notFound()
    }

    return (
        <ChecklistForm
            templateId={template.id}
            categoryId={template.categoryId}
            categoryName={template.category.name}
            initialData={{
                name: template.name,
                description: template.description,
                items: template.items as any[],
                isActive: template.isActive,
            }}
        />
    )
}
