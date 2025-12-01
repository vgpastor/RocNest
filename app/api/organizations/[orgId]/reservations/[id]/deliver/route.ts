// API Route: /api/organizations/[orgId]/reservations/[id]/deliver
// POST: Deliver materials (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { PrismaReservationRepository } from '@/app/reservations/infrastructure/PrismaReservationRepository';
import { DeliverMaterialsUseCase } from '@/app/reservations/application/use-cases/DeliverMaterialsUseCase';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ orgId: string; id: string }> }
) {
    try {
        const { orgId, id } = await params;
        const supabase = await createClient();

        // Auth check
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Admin check
        const userOrg = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.id,
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
            deliveredBy: user.id,
            items: body.items || [],
            additionalItems: body.additionalItems,
        });

        return NextResponse.json(reservation);
    } catch (error: any) {
        console.error('Error delivering materials:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to deliver materials' },
            { status: 400 }
        );
    }
}
