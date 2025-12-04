// Reservations Page - Server Component
import { Calendar, MapPin, Package, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import Link from 'next/link';

import { OrganizationContextService } from '@/app/application/services/OrganizationContextService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, EmptyState } from '@/components/ui';
import { getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';


const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'; icon: any }> = {
    pending: { label: 'Pendiente', variant: 'warning', icon: Clock },
    delivered: { label: 'Entregado', variant: 'success', icon: CheckCircle },
    in_use: { label: 'En Uso', variant: 'default', icon: Package },
    returned: { label: 'Devuelto', variant: 'secondary', icon: CheckCircle },
    completed: { label: 'Completada', variant: 'secondary', icon: CheckCircle },
    cancelled: { label: 'Cancelada', variant: 'destructive', icon: XCircle },
    delayed: { label: 'Retrasada', variant: 'destructive', icon: XCircle },
};

export default async function ReservationsPage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string }>;
}) {
    const { filter } = await searchParams;
    const currentFilter = filter || 'all';

    // Authentication is handled by middleware
    const sessionUser = await getSessionUser()

    // Get current organization
    const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId);

    if (!organizationId) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Selecciona una organización</h2>
                    <p className="text-muted-foreground">Por favor selecciona una organización para ver tus reservas</p>
                </div>
            </div>
        );
    }

    // Build where clause
    const whereClause: any = {
        organizationId,
    };

    // Filter by current user if session exists
    if (sessionUser) {
        whereClause.OR = [
            { responsibleUserId: sessionUser.userId },
            { createdBy: sessionUser.userId },
            {
                reservationUsers: {
                    some: {
                        userId: sessionUser.userId,
                    },
                },
            },
        ];
    }

    // Filter by status
    if (currentFilter === 'active') {
        whereClause.status = { in: ['pending', 'delivered', 'in_use'] };
    } else if (currentFilter === 'past') {
        whereClause.status = { in: ['returned', 'completed', 'cancelled', 'delayed'] };
    }

    // Define explicit types to avoid Prisma inference issues
    interface ReservationWithDetails {
        id: string;
        organizationId: string;
        responsibleUserId: string;
        createdBy: string;
        startDate: Date;
        estimatedReturnDate: Date;
        actualReturnDate: Date | null;
        purpose: string | null;
        notes: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        responsibleUser: {
            fullName: string | null;
            email: string;
        };
        reservationItems: {
            id: string;
            requestedQuantity: number;
            category: {
                name: string;
                icon: string | null;
            };
            actualItem: {
                id: string;
                identifier: string | null;
                product: {
                    name: string;
                };
            } | null;
        }[];
        reservationLocations: {
            location: string;
        }[];
        extensions: {
            extensionDays: number;
            motivation: string;
            createdAt: Date;
        }[];
    }

    // Fetch reservations
    const reservations = await prisma.reservation.findMany({
        where: whereClause,
        include: {
            responsibleUser: {
                select: {
                    fullName: true,
                    email: true,
                },
            },
            reservationItems: {
                include: {
                    category: {
                        select: {
                            name: true,
                            icon: true,
                        },
                    },
                    actualItem: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                }
                            }
                        },
                    },
                },
            },
            reservationLocations: true,
            extensions: {
                select: {
                    extensionDays: true,
                    motivation: true,
                    createdAt: true,
                },
            },
        },
        orderBy: {
            startDate: 'desc',
        },
    }) as unknown as ReservationWithDetails[];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mis Reservas</h1>
                    <p className="text-muted-foreground">
                        Gestiona y consulta todas tus reservas de material
                    </p>
                </div>
                <Link href="/reservations/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva Reserva
                    </Button>
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="mb-8 flex gap-2 border-b border-border">
                {[
                    { key: 'all', label: 'Todas' },
                    { key: 'active', label: 'Activas' },
                    { key: 'past', label: 'Pasadas' },
                ].map((tab) => (
                    <a
                        key={tab.key}
                        href={`/reservations?filter=${tab.key}`}
                        className={`px-4 py-2 font-medium transition-all ${currentFilter === tab.key
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </a>
                ))}
            </div>

            {/* Reservations Grid */}
            {reservations && reservations.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                    {reservations.map((reservation) => {
                        const config = statusConfig[reservation.status] || statusConfig.pending;
                        const Icon = config.icon;
                        const primaryLocation = reservation.reservationLocations[0]?.location || 'Sin ubicación';

                        return (
                            <Card key={reservation.id} className="hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-xl">{primaryLocation}</CardTitle>
                                                <Badge variant={config.variant} className="flex items-center gap-1">
                                                    <Icon className="h-3 w-3" />
                                                    {config.label}
                                                </Badge>
                                            </div>
                                            {reservation.purpose && (
                                                <CardDescription>{reservation.purpose}</CardDescription>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Dates */}
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(reservation.startDate).toLocaleDateString('es-ES')} -{' '}
                                                {new Date(reservation.estimatedReturnDate).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Locations */}
                                    {reservation.reservationLocations.length > 1 && (
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 mt-0.5" />
                                            <div>
                                                {reservation.reservationLocations.slice(0, 2).map((loc, idx) => (
                                                    <div key={idx}>{loc.location}</div>
                                                ))}
                                                {reservation.reservationLocations.length > 2 && (
                                                    <div className="text-xs">+{reservation.reservationLocations.length - 2} más</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Items */}
                                    <div>
                                        <div className="text-sm font-medium mb-2">Material:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {reservation.reservationItems.slice(0, 3).map((ri) => (
                                                <div
                                                    key={ri.id}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm"
                                                >
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                    <span>{ri.category.name}</span>
                                                    {ri.requestedQuantity > 1 && (
                                                        <span className="text-muted-foreground">x{ri.requestedQuantity}</span>
                                                    )}
                                                </div>
                                            ))}
                                            {reservation.reservationItems.length > 3 && (
                                                <div className="flex items-center px-3 py-1.5 bg-muted rounded-lg text-sm text-muted-foreground">
                                                    +{reservation.reservationItems.length - 3} más
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Extensions */}
                                    {reservation.extensions.length > 0 && (
                                        <div className="pt-2 border-t">
                                            <div className="text-xs text-muted-foreground">
                                                Ampliada {reservation.extensions.length} {reservation.extensions.length === 1 ? 'vez' : 'veces'}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Link href={`/reservations/${reservation.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                Ver Detalles
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
                    title="No tienes reservas"
                    description="¿Listo para tu próxima aventura? Crea una nueva reserva"
                    action={
                        <Link href="/reservations/new">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva Reserva
                            </Button>
                        </Link>
                    }
                />
            )}
        </div>
    );
}
