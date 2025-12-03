// API Route: /api/organizations/[orgId]/reservations/[id]/extend
// POST: Extend reservation (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { authService, AuthenticationError } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PrismaReservationRepository } from '@/app/(app)/reservations/infrastructure/PrismaReservationRepository';
import { ExtendReservationUseCase } from '@/app/(app)/reservations/application/use-cases/ExtendReservationUseCase';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ orgId: string; id: string }> }
) {
    try {
        const { orgId, id } = await params;
        const user = await authService.requireAuth();

        // Admin check
        const userOrg = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.userId,
                    organizationId: orgId,
                },
            },
        });

        if (!userOrg || !['admin', 'owner'].includes(userOrg.role)) {
            return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
        }

        const body = await request.json();

        // Use case
        const repository = new PrismaReservationRepository(prisma);
        const useCase = new ExtendReservationUseCase(repository);

        const reservation = await useCase.execute({
            reservationId: id,
            extendedBy: user.userId,
            extensionDays: body.extensionDays || 7, // Default 7 days
            motivation: body.motivation,
        });

        return NextResponse.json(reservation);
    } catch (error: any) {
        if (error instanceof AuthenticationError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error extending reservation:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to extend reservation' },
            { status: 400 }
        );
    }
}
