'use client'

import { useState } from 'react'
import { Calendar, User, MapPin, Package, Check, X, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Alert } from '@/components/ui'

// Mock data
const mockReservations = [
    {
        id: '1',
        user: { name: 'Juan Pérez', email: 'juan@example.com' },
        start_date: '2025-12-01',
        end_date: '2025-12-03',
        location: 'Picos de Europa',
        purpose: 'Escalada clásica',
        status: 'pending' as const,
        created_at: '2025-11-20T10:00:00',
        items: [
            { id: '1', name: 'Cuerda 70m', identifier: 'CRD-001', checked_out: false, checked_in: false },
            { id: '2', name: 'Arnés BD', identifier: 'ARN-001', checked_out: false, checked_in: false },
            { id: '3', name: 'Casco Petzl', identifier: 'CSC-001', checked_out: false, checked_in: false },
        ],
    },
    {
        id: '2',
        user: { name: 'María García', email: 'maria@example.com' },
        start_date: '2025-12-05',
        end_date: '2025-12-07',
        location: 'Montserrat',
        purpose: 'Vías de varios largos',
        status: 'approved' as const,
        created_at: '2025-11-21T14:30:00',
        items: [
            { id: '4', name: 'Cuerda 70m', identifier: 'CRD-002', checked_out: false, checked_in: false },
            { id: '5', name: 'Arnés BD', identifier: 'ARN-002', checked_out: false, checked_in: false },
        ],
    },
    {
        id: '3',
        user: { name: 'Carlos López', email: 'carlos@example.com' },
        start_date: '2025-11-25',
        end_date: '2025-11-28',
        location: 'Sierra Nevada',
        purpose: 'Alpinismo invernal',
        status: 'active' as const,
        created_at: '2025-11-18T09:15:00',
        items: [
            { id: '6', name: 'Piolet Grivel', identifier: 'PIO-001', checked_out: true, checked_in: false },
            { id: '7', name: 'Crampones', identifier: 'CRM-001', checked_out: true, checked_in: false },
            { id: '8', name: 'Casco Petzl', identifier: 'CSC-002', checked_out: true, checked_in: false },
            { id: '9', name: 'Cuerda 50m', identifier: 'CRD-003', checked_out: true, checked_in: false },
        ],
    },
]

const statusConfig = {
    pending: { label: 'Pendiente', variant: 'warning' as const, icon: Clock },
    approved: { label: 'Aprobada', variant: 'success' as const, icon: Check },
    active: { label: 'Activa', variant: 'default' as const, icon: Package },
    completed: { label: 'Completada', variant: 'secondary' as const, icon: Check },
    cancelled: { label: 'Cancelada', variant: 'destructive' as const, icon: X },
    rejected: { label: 'Rechazada', variant: 'destructive' as const, icon: X },
}

export default function AdminReservasPage() {
    const [filter, setFilter] = useState<'pending' | 'approved' | 'active' | 'all'>('pending')
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const filteredReservations = mockReservations.filter((res) => {
        if (filter === 'all') return true
        return res.status === filter
    })

    const handleApprove = (id: string) => {
        console.log('Approve reservation:', id)
        // TODO: Implement Supabase update
    }

    const handleReject = (id: string) => {
        console.log('Reject reservation:', id)
        // TODO: Implement Supabase update
    }

    const handleCheckout = (reservationId: string, itemId: string) => {
        console.log('Checkout item:', itemId, 'for reservation:', reservationId)
        // TODO: Implement Supabase update
    }

    const handleCheckin = (reservationId: string, itemId: string) => {
        console.log('Checkin item:', itemId, 'for reservation:', reservationId)
        // TODO: Implement Supabase update
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Gestión de Reservas</h1>
                <p className="text-muted-foreground">
                    Aprueba, gestiona y controla todas las reservas del sistema
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-8 flex gap-2 border-b border-border">
                {[
                    { key: 'pending' as const, label: 'Pendientes', count: mockReservations.filter(r => r.status === 'pending').length },
                    { key: 'approved' as const, label: 'Aprobadas', count: mockReservations.filter(r => r.status === 'approved').length },
                    { key: 'active' as const, label: 'Activas', count: mockReservations.filter(r => r.status === 'active').length },
                    { key: 'all' as const, label: 'Todas', count: mockReservations.length },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-4 py-2 font-medium transition-all flex items-center gap-2 ${filter === tab.key
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Reservations List */}
            <div className="space-y-6 animate-fade-in">
                {filteredReservations.map((reservation) => {
                    const config = statusConfig[reservation.status]
                    const Icon = config.icon
                    const isExpanded = expandedId === reservation.id

                    return (
                        <Card key={reservation.id} className="hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <CardTitle className="text-xl">{reservation.location}</CardTitle>
                                            <Badge variant={config.variant} className="flex items-center gap-1">
                                                <Icon className="h-3 w-3" />
                                                {config.label}
                                            </Badge>
                                        </div>
                                        <CardDescription className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                <span>{reservation.user.name} ({reservation.user.email})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(reservation.start_date).toLocaleDateString('es-ES')} -{' '}
                                                    {new Date(reservation.end_date).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span>{reservation.purpose}</span>
                                            </div>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Items List */}
                                <div>
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : reservation.id)}
                                        className="text-sm font-medium mb-2 hover:text-primary transition-colors"
                                    >
                                        Material solicitado ({reservation.items.length} items) {isExpanded ? '▼' : '▶'}
                                    </button>

                                    {isExpanded && (
                                        <div className="space-y-2 mt-3">
                                            {reservation.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Package className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <div className="font-medium text-sm">{item.name}</div>
                                                            <div className="text-xs text-muted-foreground">{item.identifier}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {reservation.status === 'active' && (
                                                            <>
                                                                {!item.checked_in && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant={item.checked_out ? 'default' : 'outline'}
                                                                        onClick={() => item.checked_out
                                                                            ? handleCheckin(reservation.id, item.id)
                                                                            : handleCheckout(reservation.id, item.id)
                                                                        }
                                                                    >
                                                                        {item.checked_out ? 'Devolver' : 'Entregado'}
                                                                    </Button>
                                                                )}
                                                                {item.checked_in && (
                                                                    <Badge variant="success">Devuelto</Badge>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {reservation.status === 'pending' && (
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="default"
                                            onClick={() => handleApprove(reservation.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <Check className="h-4 w-4" />
                                            Aprobar Reserva
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleReject(reservation.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <X className="h-4 w-4" />
                                            Rechazar
                                        </Button>
                                    </div>
                                )}

                                {reservation.status === 'approved' && (
                                    <Alert variant="success">
                                        <p className="text-sm">
                                            Reserva aprobada. El usuario puede recoger el material el {new Date(reservation.start_date).toLocaleDateString('es-ES')}.
                                        </p>
                                    </Alert>
                                )}

                                {reservation.status === 'active' && (
                                    <Alert variant="default">
                                        <p className="text-sm">
                                            Material en uso. Marcar items individuales como devueltos cuando se retornen.
                                        </p>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}

                {filteredReservations.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No hay reservas</h3>
                            <p className="text-sm text-muted-foreground">
                                No se encontraron reservas con el filtro seleccionado
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
