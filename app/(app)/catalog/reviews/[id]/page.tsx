import { notFound, redirect } from 'next/navigation'

import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

import ReviewForm from './ReviewForm'

interface ReviewDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
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

    // Fetch review with all related data
    const review = await prisma.itemReview.findFirst({
        where: {
            id,
            item: {
                organizationId,
            },
        },
        include: {
            item: {
                include: {
                    product: {
                        include: {
                            category: {
                                include: {
                                    checklistTemplates: {
                                        where: {
                                            isActive: true,
                                        },
                                        orderBy: {
                                            createdAt: 'desc',
                                        },
                                        take: 1,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            checkItems: true,
        },
    })

    if (!review) {
        notFound()
    }

    // Get checklist template
    const checklistTemplate = review.item.product.category?.checklistTemplates[0]
    const templateItems = (checklistTemplate?.items ?? []) as Array<{ id: string; label: string; required: boolean; type: 'boolean' | 'text' | 'number' }>

    return (
        <ReviewForm
            reviewId={review.id}
            itemName={review.item.product.name}
            itemIdentifier={review.item.identifier}
            categoryName={review.item.product.category?.name || null}
            currentStatus={review.status}
            currentPriority={review.priority}
            currentNotes={review.notes}
            checklistTemplate={templateItems}
            existingCheckItems={review.checkItems}
        />
    )
}
