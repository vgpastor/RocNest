import { redirect } from 'next/navigation'

import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function SimpleCatalogPage() {
    try {
        // Step 1: Get user
        const sessionUser = await getSessionUser()
        if (!sessionUser) redirect('/login')
        console.log('✓ Got user:', sessionUser.userId)

        // Step 2: Get organization
        const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId)
        console.log('✓ Got organization:', organizationId)

        // Step 3: Get profile/membership
        let role = 'none'
        if (organizationId) {
            const membership = await prisma.userOrganization.findUnique({
                where: {
                    userId_organizationId: {
                        userId: sessionUser.userId,
                        organizationId
                    }
                }
            })
            role = membership?.role || 'none'
        }
        console.log('✓ Got role:', role)

        // Step 4: Get categories
        const categories = organizationId
            ? await prisma.category.findMany({
                where: { organizationId },
                orderBy: { name: 'asc' }
            })
            : []
        console.log('✓ Got categories:', categories.length)

        // Step 5: Get items
        const items = organizationId
            ? await prisma.item.findMany({
                where: {
                    organizationId,
                    deletedAt: null
                },
                include: {
                    product: {
                        include: {
                            category: {
                                select: {
                                    name: true,
                                    icon: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
            : []
        console.log('✓ Got items:', items.length)

        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Simple Catalog Test (Prisma + JWT)</h1>
                <div className="space-y-4">
                    <div className="bg-green-100 p-4 rounded">
                        <p>✓ User: {sessionUser.email}</p>
                        <p>✓ Organization: {organizationId || 'None'}</p>
                        <p>✓ Role: {role}</p>
                        <p>✓ Categories: {categories.length}</p>
                        <p>✓ Items: {items.length}</p>
                    </div>
                    <div>
                        <h2 className="font-bold">Categories:</h2>
                        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60 text-xs">
                            {JSON.stringify(categories, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <h2 className="font-bold">Items (first 3):</h2>
                        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60 text-xs">
                            {JSON.stringify(items.slice(0, 3), null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.log('❌ Error:', error)
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
                <div className="bg-red-100 p-4 rounded">
                    <pre className="whitespace-pre-wrap">
                        {error instanceof Error ? error.message : String(error)}
                        {'\n\n'}
                        {error instanceof Error && error.stack}
                    </pre>
                </div>
            </div>
        )
    }
}
