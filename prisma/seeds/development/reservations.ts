// Development seed - Reservations

import { PrismaClient } from '@prisma/client'
import { generateReservationData, randomInt, randomChoice } from '../shared/factories'
import type { SeedOrganization, SeedUser, SeedItem, SeedReservation } from '../shared/types'

export async function seedReservations(
    prisma: PrismaClient,
    organizations: SeedOrganization[],
    users: SeedUser[],
    items: SeedItem[]
): Promise<SeedReservation[]> {
    const reservations: SeedReservation[] = []

    // Agrupar usuarios e items por organización
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

        // 10-30 reservas por organización
        const reservationCount = randomInt(10, 30)

        for (let i = 0; i < reservationCount; i++) {
            const randomUser = randomChoice(orgUsers)
            const reservationData = generateReservationData(org.id, randomUser.id, orgItems)

            const reservation = await prisma.reservation.create({
                data: reservationData,
            })

            // Añadir 1-5 items a la reserva
            const itemsToReserve = randomInt(1, Math.min(5, orgItems.length))
            const selectedItems = [...orgItems]
                .sort(() => Math.random() - 0.5)
                .slice(0, itemsToReserve)

            for (const item of selectedItems) {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                })

                if (product && product.categoryId) {
                    await prisma.reservationItem.create({
                        data: {
                            reservationId: reservation.id,
                            categoryId: product.categoryId,
                            requestedQuantity: 1,
                        },
                    })
                }
            }

            reservations.push(reservation)
        }
    }

    return reservations
}
