// Use Case: Return Materials
// Application layer - Admin only operation

import { IReservationRepository, ReservationWithRelations } from '../../domain/IReservationRepository';
import { ReturnMaterialRequest } from '../../domain/types';

export class ReturnMaterialsUseCase {
    constructor(private readonly reservationRepository: IReservationRepository) { }

    async execute(data: ReturnMaterialRequest): Promise<ReservationWithRelations> {
        // Get reservation to validate
        const reservation = await this.reservationRepository.findById(data.reservationId);

        if (!reservation) {
            throw new Error('Reservation not found');
        }

        // Business rule: Can only return delivered or in_use reservations
        if (!['delivered', 'in_use'].includes(reservation.status)) {
            throw new Error(`Cannot return reservation with status: ${reservation.status}`);
        }

        // Business rule: All delivered items must have inspections
        const deliveredItems = reservation.reservationItems.filter(
            item => item.actualItemId !== null
        );

        if (data.inspections.length !== deliveredItems.length) {
            throw new Error('All delivered items must be inspected');
        }

        return await this.reservationRepository.returnMaterials(data);
    }
}
