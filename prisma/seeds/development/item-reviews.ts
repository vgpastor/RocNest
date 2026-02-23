// Development seed - Item Reviews with varied states

import { PrismaClient } from '@prisma/client'

import type { SeedItem, SeedUser, SeedCategory } from '../shared/types'

export async function seedItemReviews(
    prisma: PrismaClient,
    items: SeedItem[],
    users: SeedUser[],
    categories: SeedCategory[]
): Promise<void> {
    console.log('   Creating item reviews with different states...')

    let reviewsCreated = 0

    // Get checklist templates by category
    const templatesByCategory: Record<string, { items: unknown }> = {}
    for (const category of categories) {
        const templates = await prisma.categoryChecklistTemplate.findMany({
            where: {
                categoryId: category.id,
                isActive: true,
            },
        })
        if (templates.length > 0) {
            templatesByCategory[category.id] = templates[0]
        }
    }

    // Select random items for reviews (about 20% of items)
    const itemsToReview = items
        .filter(() => Math.random() < 0.2)
        .slice(0, 50) // Max 50 reviews

    for (const item of itemsToReview) {
        // Find a user from the same organization
        const orgUsers = users.filter(u => u.organizationId === item.organizationId)
        if (orgUsers.length === 0) continue

        const reviewer = orgUsers[Math.floor(Math.random() * orgUsers.length)]

        // Get product and category
        const product = await prisma.product.findUnique({
            where: { id: item.productId },
            include: { category: true },
        })

        if (!product || !product.categoryId) continue

        // Determine review status and priority
        const statusRand = Math.random()
        let status: string
        let priority: string
        let reviewedAt: Date | null = null

        if (statusRand < 0.40) {
            // 40% pending
            status = 'pending'
            priority = Math.random() > 0.7 ? 'high' : (Math.random() > 0.5 ? 'normal' : 'low')
        } else if (statusRand < 0.70) {
            // 30% in_progress
            status = 'in_progress'
            priority = Math.random() > 0.6 ? 'high' : 'normal'
        } else if (statusRand < 0.85) {
            // 15% approved
            status = 'approved'
            priority = 'normal'
            reviewedAt = new Date()
            reviewedAt.setDate(reviewedAt.getDate() - Math.floor(Math.random() * 30))
        } else if (statusRand < 0.95) {
            // 10% rejected
            status = 'rejected'
            priority = 'high'
            reviewedAt = new Date()
            reviewedAt.setDate(reviewedAt.getDate() - Math.floor(Math.random() * 15))
        } else {
            // 5% needs_attention
            status = 'needs_attention'
            priority = 'urgent'
        }

        // Create the review
        const review = await prisma.itemReview.create({
            data: {
                itemId: item.id,
                reviewedBy: reviewer.id,
                status,
                priority,
                notes: getReviewNotes(status, product.category?.name || 'Unknown'),
                rejectionReason: status === 'rejected' ? getRejectionReason() : null,
                reviewedAt,
            },
        })

        reviewsCreated++

        // Create checklist items if template exists
        const template = templatesByCategory[product.categoryId]
        if (template && template.items) {
            const templateItems = template.items as Array<{
                id: string
                label: string
                type: string
                required: boolean
            }>

            for (const checkItem of templateItems) {
                const isCompleted = status === 'approved' || status === 'rejected' || 
                    (status === 'in_progress' && Math.random() > 0.3)

                await prisma.itemReviewCheckItem.create({
                    data: {
                        reviewId: review.id,
                        checkItemId: checkItem.id,
                        label: checkItem.label,
                        checked: isCompleted && checkItem.type === 'checkbox',
                        value: checkItem.type === 'number' && isCompleted 
                            ? String(Math.floor(Math.random() * 100)) 
                            : checkItem.type === 'text' && isCompleted && Math.random() > 0.7
                                ? 'Observación registrada'
                                : null,
                        notes: isCompleted && Math.random() > 0.8 ? 'Nota adicional del revisor' : null,
                    },
                })
            }
        }
    }

    console.log(`   ${reviewsCreated} item reviews created`)
}

function getReviewNotes(status: string, categoryName: string): string {
    const notesByStatus: Record<string, string[]> = {
        pending: [
            `Revisión pendiente de ${categoryName}`,
            'Programado para revisión esta semana',
            'Esperando disponibilidad del revisor',
        ],
        in_progress: [
            'Revisión en curso',
            'Completando checklist de verificación',
            'Realizando pruebas funcionales',
        ],
        approved: [
            'Material en perfectas condiciones',
            'Todas las verificaciones pasadas correctamente',
            'Apto para uso inmediato',
        ],
        rejected: [
            'Material no apto para uso',
            'Requiere reparación o sustitución',
            'Detectados problemas importantes',
        ],
        needs_attention: [
            'Requiere atención inmediata',
            'Posibles problemas de seguridad detectados',
            'Revisión urgente necesaria',
        ],
    }

    const notes = notesByStatus[status] || ['Revisión estándar']
    return notes[Math.floor(Math.random() * notes.length)]
}

function getRejectionReason(): string {
    const reasons = [
        'Desgaste excesivo detectado',
        'Fallo en prueba funcional',
        'Daños estructurales',
        'Material fuera de especificaciones',
        'Fecha de caducidad superada',
        'No cumple estándares de seguridad',
        'Requiere mantenimiento especializado',
    ]

    return reasons[Math.floor(Math.random() * reasons.length)]
}
