// Use Case: Extend Reservation
// Application layer - Admin only operation

import { IReservationRepository, ReservationWithRelations } from '../../domain/IReservationRepository';
import { ExtendReservationRequest } from '../../domain/types';

export class ExtendReservationUseCase {
    constructor(private readonly reservationRepository: IReservationRepository) { }

    async execute(data: ExtendReservationRequest): Promise<ReservationWithRelations> {
        // Get reservation to validate
        const reservation = await this.reservationRepository.findById(data.reservationId);

        if (!reservation) {
            throw new Error('Reservation not found');
        }

        // Business rule: Can only extend active reservations (not returned, completed, or cancelled)
        if (['returned', 'completed', 'cancelled'].includes(reservation.status)) {
            throw new Error(`Cannot extend reservation with status: ${reservation.status}`);
        }

        // Business rule: Extension days must be positive
        if (data.extensionDays <= 0) {
            throw new Error('Extension days must be greater than 0');
        }

        // Business rule: Motivation is required
        if (!data.motivation || data.motivation.trim().length === 0) {
            throw new Error('Motivation for extension is required');
        }

        return await this.reservationRepository.extendReservation(data);
    }
}
