// Use Case: Create Reservation
// Application layer - Business logic

import { IReservationRepository, ReservationWithRelations } from '../../domain/IReservationRepository';
import { CreateReservationRequest, ReservationStatus } from '../../domain/types';

export interface CreateReservationInput extends Omit<CreateReservationRequest, 'organizationId' | 'createdBy'> {
    organizationId: string;
    createdBy: string;
    creatorRole: 'admin' | 'member' | 'owner';
}

export class CreateReservationUseCase {
    constructor(private readonly reservationRepository: IReservationRepository) { }

    async execute(input: CreateReservationInput): Promise<ReservationWithRelations> {
        // Business rule: Validate dates
        if (input.startDate >= input.estimatedReturnDate) {
            throw new Error('Start date must be before estimated return date');
        }

        // Business rule: At least one item required
        if (!input.items || input.items.length === 0) {
            throw new Error('At least one item is required');
        }

        // Business rule: At least one location required
        if (!input.locations || input.locations.length === 0) {
            throw new Error('At least one location is required');
        }

        // Create reservation request
        const request: CreateReservationRequest = {
            organizationId: input.organizationId,
            responsibleUserId: input.responsibleUserId,
            createdBy: input.createdBy,
            startDate: input.startDate,
            estimatedReturnDate: input.estimatedReturnDate,
            purpose: input.purpose,
            notes: input.notes,
            additionalUserIds: input.additionalUserIds,
            locations: input.locations,
            items: input.items,
        };

        const reservation = await this.reservationRepository.create(request);

        // Business rule: Admin can create directly as delivered
        // If admin wants delivered status, they need to call DeliverMaterialsUseCase after
        // This keeps creation consistent - always starts as pending

        return reservation;
    }
}
