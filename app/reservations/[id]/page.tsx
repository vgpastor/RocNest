// Reservation Detail Page
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganizationId } from '@/lib/organization-helpers';
import { prisma } from '@/lib/prisma';
import ReservationDetails from './ReservationDetails';

export default async function ReservationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Get organization
    const organizationId = await getCurrentOrganizationId();
    if (!organizationId) redirect('/');

    // Get user role
    const userOrg = await prisma.userOrganization.findUnique({
        where: {
            userId_organizationId: {
                userId: user.id,
                organizationId,
            },
        },
    });

    const isAdmin = userOrg?.role === 'admin' || userOrg?.role === 'owner';

    // Fetch reservation with all relations
    const reservation = await prisma.reservation.findFirst({
        where: {
            id,
            organizationId,
        },
        include: {
            organization: true,
            responsibleUser: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
            reservationItems: {
                include: {
                    category: true,
                    actualItem: true,
                    deliverer: {
                        select: {
                            fullName: true,
                            email: true,
                        },
                    },
                    inspections: {
                        include: {
                            inspector: {
                                select: {
                                    fullName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            },
            reservationUsers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
            },
            reservationLocations: true,
            extensions: {
                include: {
                    extender: {
                        select: {
                            fullName: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
            activities: {
                include: {
                    performer: {
                        select: {
                            fullName: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if (!reservation) {
        notFound();
    }

    // Get available items for delivery (if admin and status is pending)
    let availableItems: any[] = [];
    if (isAdmin && reservation.status === 'pending') {
        // Get categories requested
        const categoryIds = reservation.reservationItems.map(ri => ri.categoryId);

        availableItems = await prisma.item.findMany({
            where: {
                organizationId,
                categoryId: { in: categoryIds },
                status: 'available',
            },
            include: {
                category: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    return (
        <ReservationDetails
            reservation={reservation as any}
            currentUserId={user.id}
            isAdmin={isAdmin}
            organizationId={organizationId}
            availableItems={availableItems}
        />
    );
}
