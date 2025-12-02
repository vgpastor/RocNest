import { redirect, notFound } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { PrismaItemRepository } from '../infrastructure/repositories/PrismaItemRepository'
import { PrismaCategoryRepository } from '../infrastructure/repositories/PrismaCategoryRepository'
import { PrismaTransformationRepository } from '../infrastructure/repositories/PrismaTransformationRepository'
import ItemDetailClient from './ItemDetailClient'

export default async function ItemDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // Auth check
    const sessionUser = await getSessionUser()
    if (!sessionUser) redirect('/login')

    // Fetch item details
    const itemRepo = new PrismaItemRepository()
    const categoryRepo = new PrismaCategoryRepository()
    const transformationRepo = new PrismaTransformationRepository()

    const item = await itemRepo.findById(id)
    if (!item) notFound()

    const category = await categoryRepo.findById(item.categoryId)
    const transformations = await transformationRepo.findByItemId(item.id)

    // Check admin role
    // We need to check if user is admin of the item's organization
    // Since Item entity doesn't have organizationId, we fetch it from DB
    const dbItem = await prisma.item.findUnique({
        where: { id: item.id },
        select: { organizationId: true }
    })

    let isAdmin = false
    if (dbItem) {
        const membership = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: sessionUser.userId,
                    organizationId: dbItem.organizationId
                }
            }
        })
        isAdmin = membership?.role === 'admin' || membership?.role === 'owner'
    }

    return (
        <ItemDetailClient
            item={item}
            category={category}
            transformations={transformations}
            isAdmin={isAdmin}
        />
    )
}
