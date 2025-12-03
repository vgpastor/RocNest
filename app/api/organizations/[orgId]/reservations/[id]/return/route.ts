// API Route: /api/organizations/[orgId]/reservations/[id]/return
// POST: Return materials (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { authService, AuthenticationError } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PrismaReservationRepository } from '@/app/(app)/reservations/infrastructure/PrismaReservationRepository';
import { ReturnMaterialsUseCase } from '@/app/(app)/reservations/application/use-cases/ReturnMaterialsUseCase';

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
        const useCase = new ReturnMaterialsUseCase(repository);

        const reservation = await useCase.execute({
            reservationId: id,
            inspectedBy: user.userId,
            actualReturnDate: new Date(body.actualReturnDate || new Date()),
            inspections: body.inspections || [],
        });

        return NextResponse.json(reservation);
    } catch (error: any) {
        if (error instanceof AuthenticationError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error returning materials:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to return materials' },
            { status: 400 }
        );
    }
}
