// API Route: /api/organizations/[orgId]/reservations/[id]/deliver
// POST: Deliver materials (admin only)

import { NextRequest, NextResponse } from 'next/server';

import { DeliverMaterialsUseCase } from '@/app/(app)/reservations/application/use-cases/DeliverMaterialsUseCase';
import { PrismaReservationRepository } from '@/app/(app)/reservations/infrastructure/PrismaReservationRepository';
import { authService, AuthenticationError } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
        const useCase = new DeliverMaterialsUseCase(repository);

        const reservation = await useCase.execute({
            reservationId: id,
            deliveredBy: user.userId,
            items: body.items || [],
            additionalItems: body.additionalItems,
        });

        return NextResponse.json(reservation);
    } catch (error: any) {
        if (error instanceof AuthenticationError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error delivering materials:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to deliver materials' },
            { status: 400 }
        );
    }
}
