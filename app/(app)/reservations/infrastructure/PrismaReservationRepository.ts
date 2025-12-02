// Prisma Implementation of Reservation Repository
// Infrastructure layer

import { PrismaClient } from '@prisma/client';
import {
    IReservationRepository,
    ReservationWithRelations,
} from '../domain/IReservationRepository';
import {
    CreateReservationRequest,
    DeliverMaterialRequest,
    ReturnMaterialRequest,
    ExtendReservationRequest,
    ReservationFilters,
    ReservationStatus,
} from '../domain/types';

const includeAll = {
    organization: true,
    responsibleUser: true,
    creator: true,
    reservationItems: {
        include: {
            category: true,
            actualItem: true,
            deliverer: true,
            inspections: {
                include: {
                    inspector: true,
                },
            },
        },
    },
    reservationUsers: {
        include: {
            user: true,
        },
    },
    reservationLocations: true,
    extensions: {
        include: {
            extender: true,
        },
    },
    activities: {
        include: {
            performer: true,
        },
        orderBy: {
            createdAt: 'desc' as const,
        },
    },
} as const;

export class PrismaReservationRepository implements IReservationRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(
        data: CreateReservationRequest
    ): Promise<ReservationWithRelations> {
        const { additionalUserIds, locations, items, ...reservationData } = data;

        // Determine initial status based on creator role
        // This will be validated in the use case layer
        const initialStatus: ReservationStatus = 'pending';

        const reservation = await this.prisma.reservation.create({
            data: {
                ...reservationData,
                status: initialStatus,
                // Create nested records
                reservationUsers: additionalUserIds?.length
                    ? {
                        create: additionalUserIds.map((userId) => ({
                            userId,
                        })),
                    }
                    : undefined,
                reservationLocations: {
                    create: locations,
                },
                reservationItems: {
                    create: items,
                },
                activities: {
                    create: {
                        performedBy: data.createdBy,
                        action: 'created',
                        toStatus: initialStatus,
                        notes: 'Reservation created',
                    },
                },
            },
            include: includeAll,
        });

        return reservation as ReservationWithRelations;
    }

    async findById(id: string): Promise<ReservationWithRelations | null> {
        const reservation = await this.prisma.reservation.findUnique({
            where: { id },
            include: includeAll,
        });

        return reservation as ReservationWithRelations | null;
    }

    async findMany(filters: ReservationFilters): Promise<{
        reservations: ReservationWithRelations[];
        total: number;
    }> {
        const {
            organizationId,
            status,
            userId,
            startDate,
            endDate,
            page = 1,
            limit = 20,
        } = filters;

        const where: any = {
            organizationId,
        };

        if (status) {
            where.status = status;
        }

        if (userId) {
            where.OR = [
                { responsibleUserId: userId },
                { createdBy: userId },
                {
                    reservationUsers: {
                        some: {
                            userId,
                        },
                    },
                },
            ];
        }

        if (startDate) {
            where.startDate = {
                gte: startDate,
            };
        }

        if (endDate) {
            where.estimatedReturnDate = {
                lte: endDate,
            };
        }

        const [reservations, total] = await Promise.all([
            this.prisma.reservation.findMany({
                where,
                include: includeAll,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.reservation.count({ where }),
        ]);

        return {
            reservations: reservations as ReservationWithRelations[],
            total,
        };
    }

    async updateStatus(
        id: string,
        status: ReservationStatus,
        performedBy: string,
        notes?: string
    ): Promise<ReservationWithRelations> {
        // Get current status
        const current = await this.prisma.reservation.findUnique({
            where: { id },
            select: { status: true },
        });

        if (!current) {
            throw new Error('Reservation not found');
        }

        const reservation = await this.prisma.reservation.update({
            where: { id },
            data: {
                status,
                activities: {
                    create: {
                        performedBy,
                        action: 'status_changed',
                        fromStatus: current.status,
                        toStatus: status,
                        notes,
                    },
                },
            },
            include: includeAll,
        });

        return reservation as ReservationWithRelations;
    }

    async deliverMaterials(
        data: DeliverMaterialRequest
    ): Promise<ReservationWithRelations> {
        const { reservationId, deliveredBy, items, additionalItems } = data;

        await this.prisma.$transaction(async (tx) => {
            // Update existing reservation items with actual items
            for (const item of items) {
                await tx.reservationItem.update({
                    where: { id: item.reservationItemId },
                    data: {
                        actualItemId: item.actualItemId,
                        deliveredBy,
                        deliveredAt: new Date(),
                        notes: item.notes,
                    },
                });

                // Update item status to reserved
                await tx.item.update({
                    where: { id: item.actualItemId },
                    data: { status: 'reserved' },
                });
            }

            // Add additional items if any
            if (additionalItems?.length) {
                for (const addItem of additionalItems) {
                    await tx.reservationItem.create({
                        data: {
                            reservationId,
                            categoryId: addItem.categoryId,
                            requestedQuantity: 1,
                            actualItemId: addItem.actualItemId,
                            deliveredBy,
                            deliveredAt: new Date(),
                            notes: addItem.notes,
                        },
                    });

                    await tx.item.update({
                        where: { id: addItem.actualItemId },
                        data: { status: 'reserved' },
                    });
                }
            }

            // Update reservation status
            await tx.reservation.update({
                where: { id: reservationId },
                data: {
                    status: 'delivered',
                    activities: {
                        create: {
                            performedBy: deliveredBy,
                            action: 'delivered',
                            fromStatus: 'pending',
                            toStatus: 'delivered',
                            notes: 'Materials delivered',
                        },
                    },
                },
            });
        });

        const updated = await this.findById(reservationId);
        if (!updated) {
            throw new Error('Reservation not found after delivery');
        }

        return updated;
    }

    async returnMaterials(
        data: ReturnMaterialRequest
    ): Promise<ReservationWithRelations> {
        const { reservationId, inspectedBy, actualReturnDate, inspections } = data;

        await this.prisma.$transaction(async (tx) => {
            // Create inspections and update item status
            for (const inspection of inspections) {
                // Create inspection record
                await tx.itemInspection.create({
                    data: {
                        reservationItemId: inspection.reservationItemId,
                        inspectedBy,
                        status: inspection.status,
                        notes: inspection.notes,
                        photos: inspection.photos || [],
                    },
                });

                // Update reservation item
                await tx.reservationItem.update({
                    where: { id: inspection.reservationItemId },
                    data: {
                        returnedAt: actualReturnDate,
                    },
                });

                // Get the actual item to update its status
                const resItem = await tx.reservationItem.findUnique({
                    where: { id: inspection.reservationItemId },
                    select: { actualItemId: true },
                });

                if (resItem?.actualItemId) {
                    // Update item availability based on inspection
                    let itemStatus = 'available';
                    if (inspection.status === 'needs_review') {
                        itemStatus = 'maintenance';
                    } else if (inspection.status === 'damaged') {
                        itemStatus = 'maintenance';
                    }

                    await tx.item.update({
                        where: { id: resItem.actualItemId },
                        data: { status: itemStatus },
                    });
                }
            }

            // Update reservation
            await tx.reservation.update({
                where: { id: reservationId },
                data: {
                    actualReturnDate,
                    status: 'returned',
                    activities: {
                        create: {
                            performedBy: inspectedBy,
                            action: 'returned',
                            fromStatus: 'delivered',
                            toStatus: 'returned',
                            notes: 'Materials returned and inspected',
                        },
                    },
                },
            });
        });

        const updated = await this.findById(reservationId);
        if (!updated) {
            throw new Error('Reservation not found after return');
        }

        return updated;
    }

    async extendReservation(
        data: ExtendReservationRequest
    ): Promise<ReservationWithRelations> {
        const { reservationId, extendedBy, extensionDays, motivation } = data;

        // Get current estimated return date
        const current = await this.prisma.reservation.findUnique({
            where: { id: reservationId },
            select: { estimatedReturnDate: true },
        });

        if (!current) {
            throw new Error('Reservation not found');
        }

        const previousDate = current.estimatedReturnDate;
        const newDate = new Date(previousDate);
        newDate.setDate(newDate.getDate() + extensionDays);

        const reservation = await this.prisma.reservation.update({
            where: { id: reservationId },
            data: {
                estimatedReturnDate: newDate,
                extensions: {
                    create: {
                        extendedBy,
                        extensionDays,
                        motivation,
                        previousDate,
                        newDate,
                    },
                },
                activities: {
                    create: {
                        performedBy: extendedBy,
                        action: 'extended',
                        notes: `Extended by ${extensionDays} days: ${motivation}`,
                    },
                },
            },
            include: includeAll,
        });

        return reservation as ReservationWithRelations;
    }

    async cancel(
        id: string,
        cancelledBy: string,
        reason?: string
    ): Promise<ReservationWithRelations> {
        const current = await this.prisma.reservation.findUnique({
            where: { id },
            select: { status: true },
            include: {
                reservationItems: {
                    where: {
                        actualItemId: {
                            not: null,
                        },
                    },
                    select: {
                        actualItemId: true,
                    },
                },
            },
        });

        if (!current) {
            throw new Error('Reservation not found');
        }

        await this.prisma.$transaction(async (tx) => {
            // Release reserved items if any
            for (const item of current.reservationItems) {
                if (item.actualItemId) {
                    await tx.item.update({
                        where: { id: item.actualItemId },
                        data: { status: 'available' },
                    });
                }
            }

            // Update reservation
            await tx.reservation.update({
                where: { id },
                data: {
                    status: 'cancelled',
                    activities: {
                        create: {
                            performedBy: cancelledBy,
                            action: 'cancelled',
                            fromStatus: current.status,
                            toStatus: 'cancelled',
                            notes: reason,
                        },
                    },
                },
            });
        });

        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Reservation not found after cancellation');
        }

        return updated;
    }
}
