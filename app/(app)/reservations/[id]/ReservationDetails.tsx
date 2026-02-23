// Reservation Details Client Component
'use client';

import {
    Calendar, MapPin, Package, Users, Clock, CheckCircle, XCircle,
    ArrowRight, TrendingUp, FileText, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle, Badge, BadgeProps, Button } from '@/components/ui';


import DeliverMaterialDialog from './DeliverMaterialDialog';
import ExtendReservationDialog from './ExtendReservationDialog';
import ReturnMaterialDialog from './ReturnMaterialDialog';

type IconComponent = React.ComponentType<{ className?: string }>;

interface ReservationLocation {
    location: string;
    description?: string | null;
}

interface ReservationInspection {
    id: string;
    status: string;
    notes: string | null;
}

interface ReservationItemDetail {
    id: string;
    requestedQuantity: number;
    categoryId: string;
    actualItemId: string | null;
    deliveredAt: string | null;
    returnedAt: string | null;
    notes: string | null;
    category: { name: string };
    actualItem: {
        name: string;
        identifier: string | null;
        product: { id: string; name: string } | null;
    } | null;
    deliverer: { fullName: string | null; email: string } | null;
    inspections: ReservationInspection[];
}

interface ReservationUser {
    id: string;
    user: { fullName: string | null; email: string };
}

interface ReservationExtension {
    extensionDays: number;
    motivation: string;
    createdAt: string;
    extender: { fullName: string | null; email: string };
}

interface ReservationActivity {
    id: string;
    action: string;
    notes: string | null;
    createdAt: string;
}

interface OrganizationItem {
    id: string;
    status: string;
    identifier: string | null;
    categoryId: string | null;
    product: { id: string; name: string };
}

interface CategoryOption {
    id: string;
    name: string;
}

interface ReservationData {
    id: string;
    status: string;
    createdAt: string;
    startDate: string;
    estimatedReturnDate: string;
    actualReturnDate: string | null;
    purpose: string | null;
    notes: string | null;
    responsibleUser: { fullName: string | null; email: string };
    creator: { fullName: string | null; email: string };
    reservationItems: ReservationItemDetail[];
    reservationLocations: ReservationLocation[];
    reservationUsers: ReservationUser[];
    extensions: ReservationExtension[];
    activities: ReservationActivity[];
}

interface ReservationDetailsProps {
    reservation: ReservationData;
    currentUserId: string;
    isAdmin: boolean;
    organizationId: string;
    organizationItems: OrganizationItem[];
    allCategories: CategoryOption[];
}

const statusConfig: Record<string, { label: string; variant: NonNullable<BadgeProps['variant']>; icon: IconComponent; color: string }> = {
    pending: { label: 'Pendiente', variant: 'warning', icon: Clock, color: 'text-yellow-600' },
    delivered: { label: 'Entregado', variant: 'success', icon: CheckCircle, color: 'text-green-600' },
    in_use: { label: 'En Uso', variant: 'default', icon: Package, color: 'text-blue-600' },
    returned: { label: 'Devuelto', variant: 'secondary', icon: CheckCircle, color: 'text-gray-600' },
    completed: { label: 'Completada', variant: 'secondary', icon: CheckCircle, color: 'text-gray-600' },
    cancelled: { label: 'Cancelada', variant: 'destructive', icon: XCircle, color: 'text-red-600' },
    delayed: { label: 'Retrasada', variant: 'destructive', icon: AlertCircle, color: 'text-red-600' },
};

export default function ReservationDetails({
    reservation,
    currentUserId: _currentUserId,
    isAdmin,
    organizationId,
    organizationItems,
    allCategories
}: ReservationDetailsProps) {
    const router = useRouter();
    const [showDeliverDialog, setShowDeliverDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [showExtendDialog, setShowExtendDialog] = useState(false);

    const config = statusConfig[reservation.status] || statusConfig.pending;
    const Icon = config.icon;

    const canDeliver = isAdmin && ['pending', 'delivered', 'in_use'].includes(reservation.status);
    const canReturn = isAdmin && ['delivered', 'in_use'].includes(reservation.status);
    const canExtend = isAdmin && !['returned', 'completed', 'cancelled'].includes(reservation.status);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (date: string) => {
        return new Date(date).toLocaleString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">Reserva #{reservation.id.slice(0, 8)}</h1>
                        <Badge variant={config.variant} className="flex items-center gap-1">
                            <Icon className="h-3 w-3" />
                            {config.label}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Creada el {formatDateTime(reservation.createdAt)}
                    </p>
                </div>
                <Link href="/reservations">
                    <Button variant="outline">Volver a Reservas</Button>
                </Link>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg">Acciones de Administrador</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {canDeliver && (
                            <Button onClick={() => setShowDeliverDialog(true)}>
                                <Package className="h-4 w-4 mr-2" />
                                Entregar Material
                            </Button>
                        )}
                        {canReturn && (
                            <Button onClick={() => setShowReturnDialog(true)} variant="secondary">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Devolver Material
                            </Button>
                        )}
                        {canExtend && (
                            <Button onClick={() => setShowExtendDialog(true)} variant="outline">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Ampliar Reserva
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Dates & Purpose */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium">Fecha de Inicio</div>
                                        <div className="text-muted-foreground">{formatDate(reservation.startDate)}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium">Devolución Estimada</div>
                                        <div className="text-muted-foreground">{formatDate(reservation.estimatedReturnDate)}</div>
                                    </div>
                                </div>
                            </div>

                            {reservation.actualReturnDate && (
                                <div className="flex items-start gap-3 pt-2 border-t">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium">Devuelto el</div>
                                        <div className="text-muted-foreground">{formatDate(reservation.actualReturnDate)}</div>
                                    </div>
                                </div>
                            )}

                            {reservation.purpose && (
                                <div className="pt-2 border-t">
                                    <div className="text-sm font-medium mb-1">Propósito</div>
                                    <p className="text-muted-foreground">{reservation.purpose}</p>
                                </div>
                            )}

                            {reservation.notes && (
                                <div className="pt-2 border-t">
                                    <div className="text-sm font-medium mb-1">Notas</div>
                                    <p className="text-muted-foreground">{reservation.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Locations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Ubicaciones / Destinos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {reservation.reservationLocations.map((loc: ReservationLocation, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{loc.location}</div>
                                            {loc.description && (
                                                <div className="text-sm text-muted-foreground">{loc.description}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Material
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reservation.reservationItems.map((item: ReservationItemDetail) => {
                                    const isDelivered = !!item.actualItem;
                                    const isReturned = !!item.returnedAt;

                                    return (
                                        <div key={item.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors space-y-3">
                                            {/* Header: Product/Category & Status */}
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {item.category.name}
                                                    </div>
                                                    <div className="font-semibold text-lg">
                                                        {item.actualItem ? (
                                                            <span className="flex items-center gap-2">
                                                                {item.actualItem.product?.name || item.actualItem.name}
                                                                {item.actualItem.identifier && (
                                                                    <Badge variant="secondary" className="text-xs font-normal">
                                                                        {item.actualItem.identifier}
                                                                    </Badge>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground italic">Pendiente de asignar</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    {isReturned ? (
                                                        <Badge variant="secondary" className="flex items-center gap-1">
                                                            <CheckCircle className="h-3 w-3" /> Devuelto
                                                        </Badge>
                                                    ) : isDelivered ? (
                                                        <Badge variant="success" className="flex items-center gap-1">
                                                            <Package className="h-3 w-3" /> Entregado
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Solicitado: {item.requestedQuantity}</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Timeline / Details */}
                                            {(isDelivered || isReturned) && (
                                                <div className="grid gap-2 text-sm bg-muted/30 p-3 rounded-md border border-border/50">
                                                    {/* Delivery Info */}
                                                    {item.deliverer && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <ArrowRight className="h-4 w-4 text-green-600" />
                                                            <span>
                                                                Entregado por <span className="font-medium text-foreground">{item.deliverer.fullName || item.deliverer.email}</span>
                                                                {item.deliveredAt && ` el ${formatDateTime(item.deliveredAt)}`}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Return Info */}
                                                    {item.returnedAt && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <CheckCircle className="h-4 w-4 text-gray-600" />
                                                            <span>
                                                                Devuelto el <span className="font-medium text-foreground">{formatDateTime(item.returnedAt)}</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Inspections */}
                                            {item.inspections?.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="text-xs font-medium text-muted-foreground">Estado de devolución</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.inspections.map((insp: ReservationInspection) => (
                                                            <div key={insp.id} className={`flex items-center gap-2 px-2 py-1 rounded text-sm border ${insp.status === 'ok' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' :
                                                                insp.status === 'damaged' ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400' :
                                                                    'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                                                                }`}>
                                                                {insp.status === 'ok' ? <CheckCircle className="h-3 w-3" /> :
                                                                    insp.status === 'damaged' ? <XCircle className="h-3 w-3" /> :
                                                                        <AlertCircle className="h-3 w-3" />}
                                                                <span className="font-medium">
                                                                    {insp.status === 'ok' ? 'OK' :
                                                                        insp.status === 'damaged' ? 'Dañado' : 'Revisar'}
                                                                </span>
                                                                {insp.notes && <span className="text-xs opacity-80 border-l pl-2 ml-1 border-current/20">{insp.notes}</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {item.notes && (
                                                <div className="text-xs text-muted-foreground italic pt-2 border-t">
                                                    Nota: {item.notes}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Users */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Users className="h-4 w-4" />
                                Usuarios
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Responsable</div>
                                <div className="font-medium">
                                    {reservation.responsibleUser.fullName || reservation.responsibleUser.email}
                                </div>
                            </div>

                            {reservation.reservationUsers.length > 0 && (
                                <div className="pt-2 border-t">
                                    <div className="text-xs text-muted-foreground mb-2">Usuarios Adicionales</div>
                                    {reservation.reservationUsers.map((ru: ReservationUser) => (
                                        <div key={ru.id} className="text-sm">
                                            {ru.user.fullName || ru.user.email}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-2 border-t">
                                <div className="text-xs text-muted-foreground mb-1">Creada por</div>
                                <div className="text-sm">
                                    {reservation.creator.fullName || reservation.creator.email}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Extensions */}
                    {reservation.extensions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <TrendingUp className="h-4 w-4" />
                                    Ampliaciones ({reservation.extensions.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {reservation.extensions.map((ext: ReservationExtension, idx: number) => (
                                    <div key={idx} className="p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium">+{ext.extensionDays} días</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(ext.createdAt.split('T')[0])}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{ext.motivation}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Por {ext.extender.fullName || ext.extender.email}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Activity Log */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4" />
                                Historial
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {reservation.activities.slice(0, 5).map((activity: ReservationActivity) => (
                                <div key={activity.id} className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="font-medium capitalize">{activity.action.replace('_', ' ')}</span>
                                    </div>
                                    {activity.notes && (
                                        <div className="text-xs text-muted-foreground ml-4">{activity.notes}</div>
                                    )}
                                    <div className="text-xs text-muted-foreground ml-4">
                                        {formatDateTime(activity.createdAt)}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialogs */}
            {showDeliverDialog && (
                <DeliverMaterialDialog
                    reservation={reservation}
                    organizationItems={organizationItems}
                    allCategories={allCategories}
                    organizationId={organizationId}
                    onClose={() => setShowDeliverDialog(false)}
                    onSuccess={() => router.refresh()}
                />
            )}

            {showReturnDialog && (
                <ReturnMaterialDialog
                    reservation={reservation}
                    organizationId={organizationId}
                    onClose={() => setShowReturnDialog(false)}
                    onSuccess={() => router.refresh()}
                />
            )}

            {showExtendDialog && (
                <ExtendReservationDialog
                    reservation={reservation}
                    organizationId={organizationId}
                    onClose={() => setShowExtendDialog(false)}
                    onSuccess={() => router.refresh()}
                />
            )}
        </div>
    );
}
