// Reservation Detail Page
import { Prisma } from '@prisma/client';
import { redirect, notFound } from 'next/navigation';

import { OrganizationContextService } from '@/app/application/services/OrganizationContextService';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

import ReservationDetails from './ReservationDetails';

type ReservationQueryResult = Prisma.ReservationGetPayload<{
    include: {
        organization: true;
        responsibleUser: {
            select: { id: true; fullName: true; email: true };
        };
        creator: {
            select: { id: true; fullName: true; email: true };
        };
        reservationItems: {
            include: {
                category: true;
                actualItem: {
                    include: { product: true };
                };
                deliverer: {
                    select: { fullName: true; email: true };
                };
                inspections: {
                    include: {
                        inspector: {
                            select: { fullName: true; email: true };
                        };
                    };
                };
            };
        };
        reservationUsers: {
            include: {
                user: {
                    select: { id: true; fullName: true; email: true };
                };
            };
        };
        reservationLocations: true;
        extensions: {
            include: {
                extender: {
                    select: { fullName: true; email: true };
                };
            };
        };
        activities: {
            include: {
                performer: {
                    select: { fullName: true; email: true };
                };
            };
        };
    };
}>;

interface FlattenedOrganizationItem {
    id: string;
    organizationId: string;
    productId: string;
    status: string;
    identifier: string | null;
    hasUniqueNumbering: boolean;
    isComposite: boolean;
    metadata: Prisma.JsonValue;
    originTransformationId: string | null;
    deletedAt: Date | null;
    deletionReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    product: Prisma.ProductGetPayload<{ include: { category: true } }>;
    name: string;
    categoryId: string | null;
    category: Prisma.CategoryGetPayload<Record<string, never>> | null;
}

type CategoryRecord = Prisma.CategoryGetPayload<Record<string, never>>;

export default async function ReservationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Auth check
    const sessionUser = await getSessionUser();
    if (!sessionUser) redirect('/login');

    // Get organization
    const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId);
    if (!organizationId) redirect('/');

    // Get user role
    const userOrg = await prisma.userOrganization.findUnique({
        where: {
            userId_organizationId: {
                userId: sessionUser.userId,
                organizationId,
            },
        },
    });

    const isAdmin = userOrg?.role === 'admin';

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
                    actualItem: {
                        include: {
                            product: true,
                        },
                    },
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
    }) as ReservationQueryResult | null;

    if (!reservation) {
        notFound();
    }

    // Get all available data for delivery (if admin and status is pending)
    let organizationItems: FlattenedOrganizationItem[] = [];
    let allCategories: CategoryRecord[] = [];

    if (isAdmin && ['pending', 'delivered', 'in_use'].includes(reservation.status)) {
        // Get all categories for the organization
        allCategories = await prisma.category.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });

        // Get all items for the organization (not just available ones)
        const rawItems = await prisma.item.findMany({
            where: {
                organizationId,
            },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                product: {
                    name: 'asc',
                },
            },
        });

        // Map items to flatten structure for the UI
        organizationItems = rawItems.map(item => ({
            ...item,
            name: item.product.name,
            categoryId: item.product.categoryId,
            category: item.product.category,
        }));
    }

    return (
        <ReservationDetails
            reservation={JSON.parse(JSON.stringify(reservation))}
            currentUserId={sessionUser.userId}
            isAdmin={isAdmin}
            organizationId={organizationId}
            organizationItems={organizationItems}
            allCategories={allCategories}
        />
    );
}
