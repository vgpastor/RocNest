// API Route: /api/organizations/[orgId]/reservations/[id]
// GET: Get reservation details

import { NextRequest, NextResponse } from 'next/server';
import { authService, AuthenticationError } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PrismaReservationRepository } from '@/app/reservations/infrastructure/PrismaReservationRepository';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orgId: string; id: string }> }
) {
    try {
        const { orgId, id } = await params;
        await authService.requireAuth();

        // Use repository
        const repository = new PrismaReservationRepository(prisma);
        const reservation = await repository.findById(id);

        if (!reservation) {
            return NextResponse.json(
                { error: 'Reservation not found' },
                { status: 404 }
            );
        }

        // Verify belongs to organization
        if (reservation.organizationId !== orgId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(reservation);
    } catch (error) {
        if (error instanceof AuthenticationError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error fetching reservation:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reservation' },
            { status: 500 }
        );
    }
}
