// API Route: /api/organizations/[orgId]/reservations
// GET: List reservations, POST: Create reservation

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { PrismaReservationRepository } from '@/app/reservations/infrastructure/PrismaReservationRepository';
import { CreateReservationUseCase } from '@/app/reservations/application/use-cases/CreateReservationUseCase';
import { ReservationFilters } from '@/app/reservations/domain/types';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orgId: string }> }
) {
    try {
        const { orgId } = await params;
        const supabase = await createClient();

        // Auth check
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query params
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Build filters
        const filters: ReservationFilters = {
            organizationId: orgId,
            page,
            limit,
        };

        if (status) {
            filters.status = status as any;
        }

        if (userId) {
            filters.userId = userId;
        }

        // Use repository
        const repository = new PrismaReservationRepository(prisma);
        const result = await repository.findMany(filters);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reservations' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ orgId: string }> }
) {
    try {
        const { orgId } = await params;
        const supabase = await createClient();

        // Auth check
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user role in organization
        const userOrg = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.id,
                    organizationId: orgId,
                },
            },
        });

        if (!userOrg) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();

        // Parse dates
        const requestData = {
            ...body,
            startDate: new Date(body.startDate),
            estimatedReturnDate: new Date(body.estimatedReturnDate),
        };

        // Use case
        const repository = new PrismaReservationRepository(prisma);
        const useCase = new CreateReservationUseCase(repository);

        const reservation = await useCase.execute({
            organizationId: orgId,
            createdBy: user.id,
            creatorRole: userOrg.role as any,
            ...requestData,
        });

        return NextResponse.json(reservation, { status: 201 });
    } catch (error: any) {
        console.error('Error creating reservation:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create reservation' },
            { status: 400 }
        );
    }
}
