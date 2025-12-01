// Use Case: Deliver Materials
// Application layer - Admin only operation

import { IReservationRepository, ReservationWithRelations } from '../../domain/IReservationRepository';
import { DeliverMaterialRequest } from '../../domain/types';

export class DeliverMaterialsUseCase {
    constructor(private readonly reservationRepository: IReservationRepository) { }

    async execute(data: DeliverMaterialRequest): Promise<ReservationWithRelations> {
        // Get reservation to validate current status
        const reservation = await this.reservationRepository.findById(data.reservationId);

        if (!reservation) {
            throw new Error('Reservation not found');
        }

        // Business rule: Can only deliver pending reservations
        if (reservation.status !== 'pending') {
            throw new Error(`Cannot deliver reservation with status: ${reservation.status}`);
        }

        // Business rule: All items must have actual items assigned
        if (data.items.length === 0 && !data.additionalItems?.length) {
            throw new Error('At least one item must be delivered');
        }

        return await this.reservationRepository.deliverMaterials(data);
    }
}
