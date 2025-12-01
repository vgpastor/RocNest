// Domain types for Reservation System
// Following pragmatic DDD approach

export type ReservationStatus =
    | 'pending'
    | 'delivered'
    | 'in_use'
    | 'returned'
    | 'completed'
    | 'cancelled'
    | 'delayed';

export type InspectionStatus = 'ok' | 'needs_review' | 'damaged';

export type ReservationActivityAction =
    | 'created'
    | 'status_changed'
    | 'delivered'
    | 'returned'
    | 'extended'
    | 'cancelled';

export interface CreateReservationRequest {
    organizationId: string;
    responsibleUserId: string;
    createdBy: string;
    startDate: Date;
    estimatedReturnDate: Date;
    purpose?: string;
    notes?: string;
    additionalUserIds?: string[];
    locations: Array<{
        location: string;
        description?: string;
    }>;
    items: Array<{
        categoryId: string;
        requestedQuantity: number;
        notes?: string;
    }>;
}

export interface DeliverMaterialRequest {
    reservationId: string;
    deliveredBy: string;
    items: Array<{
        reservationItemId: string;
        actualItemId: string;
        notes?: string;
    }>;
    additionalItems?: Array<{
        categoryId: string;
        actualItemId: string;
        notes?: string;
    }>;
}

export interface ReturnMaterialRequest {
    reservationId: string;
    inspectedBy: string;
    actualReturnDate: Date;
    inspections: Array<{
        reservationItemId: string;
        status: InspectionStatus;
        notes?: string;
        photos?: string[];
    }>;
}

export interface ExtendReservationRequest {
    reservationId: string;
    extendedBy: string;
    extensionDays: number;
    motivation: string;
}

export interface ReservationFilters {
    organizationId: string;
    status?: ReservationStatus;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}
