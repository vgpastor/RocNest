// Repository Interface for Reservations
// Following Repository Pattern (DDD)

import { Prisma } from '@prisma/client';
import {
    CreateReservationRequest,
    DeliverMaterialRequest,
    ReturnMaterialRequest,
    ExtendReservationRequest,
    ReservationFilters,
    ReservationStatus,
} from '../domain/types';

// Complete reservation with all relations
export type ReservationWithRelations = Prisma.ReservationGetPayload<{
    include: {
        organization: true;
        responsibleUser: true;
        creator: true;
        reservationItems: {
            include: {
                category: true;
                actualItem: true;
                deliverer: true;
                inspections: {
                    include: {
                        inspector: true;
                    };
                };
            };
        };
        reservationUsers: {
            include: {
                user: true;
            };
        };
        reservationLocations: true;
        extensions: {
            include: {
                extender: true;
            };
        };
        activities: {
            include: {
                performer: true;
            };
        };
    };
}>;

export interface IReservationRepository {
    // Create
    create(data: CreateReservationRequest): Promise<ReservationWithRelations>;

    // Read
    findById(id: string): Promise<ReservationWithRelations | null>;
    findMany(filters: ReservationFilters): Promise<{
        reservations: ReservationWithRelations[];
        total: number;
    }>;

    // Update
    updateStatus(
        id: string,
        status: ReservationStatus,
        performedBy: string,
        notes?: string
    ): Promise<ReservationWithRelations>;

    // Deliver
    deliverMaterials(
        data: DeliverMaterialRequest
    ): Promise<ReservationWithRelations>;

    // Return
    returnMaterials(
        data: ReturnMaterialRequest
    ): Promise<ReservationWithRelations>;

    // Extend
    extendReservation(
        data: ExtendReservationRequest
    ): Promise<ReservationWithRelations>;

    // Cancel
    cancel(
        id: string,
        cancelledBy: string,
        reason?: string
    ): Promise<ReservationWithRelations>;
}
