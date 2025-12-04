import { redirect } from 'next/navigation'

import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

import NewItemForm from './NewItemForm'

export default async function NewItemPage() {
    const sessionUser = await getSessionUser()
    if (!sessionUser) redirect('/login')

    const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId)
    if (!organizationId) redirect('/')

    // Check if user is admin
    const membership = await prisma.userOrganization.findUnique({
        where: {
            userId_organizationId: {
                userId: sessionUser.userId,
                organizationId
            }
        }
    })

    if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
        redirect('/catalogo')
    }

    // Fetch categories
    const categoriesList = await prisma.category.findMany({
        where: { organizationId },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Agregar Nuevo Material</h1>
            <NewItemForm categories={JSON.parse(JSON.stringify(categoriesList))} />
        </div>
    )
}
