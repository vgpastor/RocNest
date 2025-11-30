import { Calendar, MapPin, Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, EmptyState } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'; icon: any; description: string }> = {
    pending: {
        label: 'Pendiente',
        variant: 'warning',
        icon: Clock,
        description: 'Esperando aprobación del administrador',
    },
    approved: {
        label: 'Aprobada',
        variant: 'success',
        icon: CheckCircle,
        description: 'Reserva aprobada, recuerda recoger el material',
    },
    active: {
        label: 'Activa',
        variant: 'default',
        icon: Package,
        description: 'Material en uso',
    },
    completed: {
        label: 'Completada',
        variant: 'secondary',
        icon: CheckCircle,
        description: 'Material devuelto',
    },
    cancelled: {
        label: 'Cancelada',
        variant: 'destructive',
        icon: XCircle,
        description: 'Reserva cancelada',
    },
    rejected: {
        label: 'Rechazada',
        variant: 'destructive',
        icon: XCircle,
        description: 'Reserva rechazada por el administrador',
    },
}

export default async function ReservasPage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string }>
}) {
    const supabase = await createClient()
    const { filter } = await searchParams
    const currentFilter = filter || 'all'

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    let query = supabase
        .from('reservations')
        .select(`
            *,
            reservation_items (
                item:items (*)
            )
        `)
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })

    if (currentFilter === 'active') {
        query = query.in('status', ['pending', 'approved', 'active'])
    } else if (currentFilter === 'past') {
        query = query.in('status', ['completed', 'cancelled', 'rejected'])
    }

    const { data: reservations } = await query

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mis Reservas</h1>
                <p className="text-muted-foreground">
                    Gestiona y consulta todas tus reservas de material
                </p>
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
                        href={`/reservas?filter=${tab.key}`}
                        className={`px-4 py-2 font-medium transition-all ${currentFilter === tab.key
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </a>
                ))}
            </div>

            {/* Reservations List */}
            {reservations && reservations.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                    {reservations.map((reservation) => {
                        const config = statusConfig[reservation.status] || statusConfig.pending
                        const Icon = config.icon

                        return (
                            <Card key={reservation.id} className="hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-xl">{reservation.location || 'Sin ubicación'}</CardTitle>
                                                <Badge variant={config.variant} className="flex items-center gap-1">
                                                    <Icon className="h-3 w-3" />
                                                    {config.label}
                                                </Badge>
                                            </div>
                                            <CardDescription>{reservation.purpose}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Dates */}
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(reservation.start_date).toLocaleDateString('es-ES')} -{' '}
                                                {new Date(reservation.end_date).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                        {reservation.location && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>{reservation.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div>
                                        <div className="text-sm font-medium mb-2">Material solicitado:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {reservation.reservation_items?.map((ri: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm"
                                                >
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                    <span>{ri.item?.name || 'Item desconocido'}</span>
                                                    <span className="text-muted-foreground">({ri.item?.identifier || '?'})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions based on status */}
                                    {reservation.status === 'pending' && (
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="destructive" size="sm">
                                                Cancelar Reserva
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
                    title="No tienes reservas"
                    description="¿Listo para tu próxima aventura? Explora nuestro catálogo"
                    action={
                        <a href="/catalogo">
                            <Button>
                                Ver Catálogo
                            </Button>
                        </a>
                    }
                />
            )}
        </div>
    )
}
