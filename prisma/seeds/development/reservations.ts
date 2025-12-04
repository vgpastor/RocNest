// Development seed - Reservations with varied states

import { PrismaClient } from '@prisma/client'

import type { SeedOrganization, SeedUser, SeedItem, SeedReservation } from '../shared/types'

// Helper to generate random date in the past
function randomPastDate(daysAgo: number): Date {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
    return date
}

// Helper to generate random date in the future
function randomFutureDate(daysAhead: number): Date {
    const date = new Date()
    date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead))
    return date
}

// Helper to get random items from a list
function getRandomItems<T>(items: T[], count: number): T[] {
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, items.length))
}

export async function seedReservations(
    prisma: PrismaClient,
    organizations: SeedOrganization[],
    users: SeedUser[],
    items: SeedItem[]
): Promise<SeedReservation[]> {
    const reservations: SeedReservation[] = []

    // Group users and items by organization
    const usersByOrg: Record<string, SeedUser[]> = {}
    const itemsByOrg: Record<string, SeedItem[]> = {}

    for (const user of users) {
        if (!usersByOrg[user.organizationId]) {
            usersByOrg[user.organizationId] = []
        }
        usersByOrg[user.organizationId].push(user)
    }

    for (const item of items) {
        if (!itemsByOrg[item.organizationId]) {
            itemsByOrg[item.organizationId] = []
        }
        itemsByOrg[item.organizationId].push(item)
    }

    for (const org of organizations) {
        const orgUsers = usersByOrg[org.id] || []
        const orgItems = itemsByOrg[org.id] || []

        if (orgUsers.length === 0 || orgItems.length === 0) continue

        console.log(`   Creating reservations for ${org.name}...`)

        // Create different types of reservations
        const reservationTypes = [
            { type: 'open-pending', count: 3 }, // Abiertas pendientes
            { type: 'open-approved', count: 3 }, // Abiertas aprobadas
            { type: 'active-delivered', count: 4 }, // En curso (entregadas)
            { type: 'delayed', count: 3 }, // Con retraso
            { type: 'returned-needs-review', count: 4 }, // Devueltas pendientes de revisión
            { type: 'returned-completed', count: 5 }, // Devueltas y completadas
            { type: 'cancelled', count: 2 }, // Canceladas
        ]

        for (const resType of reservationTypes) {
            for (let i = 0; i < resType.count; i++) {
                const randomUser = orgUsers[Math.floor(Math.random() * orgUsers.length)]
                let startDate: Date
                let estimatedReturnDate: Date
                let actualReturnDate: Date | null = null
                let status: string

                switch (resType.type) {
                    case 'open-pending':
                        // Future reservation, pending approval
                        startDate = randomFutureDate(30)
                        estimatedReturnDate = new Date(startDate)
                        estimatedReturnDate.setDate(estimatedReturnDate.getDate() + Math.floor(Math.random() * 7) + 3)
                        status = 'pending'
                        break

                    case 'open-approved':
                        // Future reservation, approved
                        startDate = randomFutureDate(30)
                        estimatedReturnDate = new Date(startDate)
                        estimatedReturnDate.setDate(estimatedReturnDate.getDate() + Math.floor(Math.random() * 7) + 3)
                        status = 'approved'
                        break

                    case 'active-delivered':
                        // Current reservation, material delivered
                        startDate = randomPastDate(7)
                        estimatedReturnDate = randomFutureDate(7)
                        status = 'delivered'
                        break

                    case 'delayed':
                        // Past estimated return date but not returned
                        startDate = randomPastDate(30)
                        estimatedReturnDate = randomPastDate(7) // Past date
                        status = 'delivered' // Still delivered, not returned
                        break

                    case 'returned-needs-review':
                        // Returned but needs item review
                        startDate = randomPastDate(30)
                        estimatedReturnDate = randomPastDate(10)
                        actualReturnDate = randomPastDate(5)
                        status = 'returned'
                        break

                    case 'returned-completed':
                        // Returned and completed
                        startDate = randomPastDate(60)
                        estimatedReturnDate = randomPastDate(30)
                        actualReturnDate = randomPastDate(25)
                        status = 'returned'
                        break

                    case 'cancelled':
                        // Cancelled reservation
                        startDate = randomPastDate(30)
                        estimatedReturnDate = new Date(startDate)
                        estimatedReturnDate.setDate(estimatedReturnDate.getDate() + 5)
                        status = 'cancelled'
                        break

                    default:
                        startDate = new Date()
                        estimatedReturnDate = new Date()
                        status = 'pending'
                }

                // Create reservation
                const reservation = await prisma.reservation.create({
                    data: {
                        organizationId: org.id,
                        responsibleUserId: randomUser.id,
                        createdBy: randomUser.id,
                        startDate,
                        estimatedReturnDate,
                        actualReturnDate,
                        purpose: getPurpose(resType.type),
                        notes: Math.random() > 0.6 ? `Notas para reserva ${resType.type}` : null,
                        status,
                    },
                })

                reservations.push(reservation)

                // Add items to reservation
                const itemCount = Math.floor(Math.random() * 4) + 1 // 1-4 items
                const selectedItems = getRandomItems(orgItems.filter(i => i.status === 'available' || i.status === 'in_use'), itemCount)

                for (const item of selectedItems) {
                    // Get product to find category
                    const product = await prisma.product.findUnique({
                        where: { id: item.productId },
                    })

                    if (!product || !product.categoryId) continue

                    const needsReview = resType.type === 'returned-needs-review' && Math.random() > 0.5

                    const reservationItem = await prisma.reservationItem.create({
                        data: {
                            reservationId: reservation.id,
                            categoryId: product.categoryId,
                            requestedQuantity: 1,
                            actualItemId: status === 'pending' ? null : item.id,
                            deliveredBy: status !== 'pending' && status !== 'cancelled' ? randomUser.id : null,
                            deliveredAt: status !== 'pending' && status !== 'cancelled' ? startDate : null,
                            returnedAt: actualReturnDate,
                        },
                    })

                    // Create ItemReview if returned and needs review
                    if (needsReview && actualReturnDate) {
                        await prisma.itemReview.create({
                            data: {
                                itemId: item.id,
                                reviewedBy: randomUser.id,
                                status: 'pending',
                                priority: Math.random() > 0.7 ? 'high' : 'normal',
                                notes: 'Pendiente de revisión tras devolución',
                            },
                        })
                    }

                    // Create inspection if returned
                    if (actualReturnDate && Math.random() > 0.3) {
                        await prisma.itemInspection.create({
                            data: {
                                reservationItemId: reservationItem.id,
                                inspectedBy: randomUser.id,
                                status: needsReview ? 'needs_review' : (Math.random() > 0.9 ? 'damaged' : 'ok'),
                                notes: needsReview ? 'Requiere revisión detallada' : 'Material en buen estado',
                            },
                        })
                    }
                }

                // Add activity log
                await prisma.reservationActivity.create({
                    data: {
                        reservationId: reservation.id,
                        performedBy: randomUser.id,
                        action: 'created',
                        toStatus: status,
                        notes: `Reserva creada en estado ${status}`,
                    },
                })

                // Add status change activity if applicable
                if (status === 'delivered' || status === 'returned' || status === 'cancelled') {
                    await prisma.reservationActivity.create({
                        data: {
                            reservationId: reservation.id,
                            performedBy: randomUser.id,
                            action: 'status_changed',
                            fromStatus: 'approved',
                            toStatus: status,
                            notes: `Estado cambiado a ${status}`,
                            createdAt: status === 'returned' && actualReturnDate ? actualReturnDate : new Date(),
                        },
                    })
                }

                // Add extension if delayed
                if (resType.type === 'delayed' && Math.random() > 0.5) {
                    const originalDate = new Date(estimatedReturnDate)
                    const newDate = randomFutureDate(14)

                    await prisma.reservationExtension.create({
                        data: {
                            reservationId: reservation.id,
                            extendedBy: randomUser.id,
                            extensionDays: Math.floor((newDate.getTime() - originalDate.getTime()) / (1000 * 60 * 60 * 24)),
                            motivation: 'Necesidad de más tiempo para completar la actividad',
                            previousDate: originalDate,
                            newDate: newDate,
                        },
                    })
                }
            }
        }
    }

    return reservations
}

function getPurpose(type: string): string {
    const purposes = {
        'open-pending': 'Salida de escalada deportiva',
        'open-approved': 'Curso de formación',
        'active-delivered': 'Exploración espeleológica',
        'delayed': 'Expedición de varios días',
        'returned-needs-review': 'Práctica de técnicas verticales',
        'returned-completed': 'Instalación de vía equipada',
        'cancelled': 'Salida cancelada por meteorología',
    }

    return purposes[type as keyof typeof purposes] || 'Actividad de club'
}
