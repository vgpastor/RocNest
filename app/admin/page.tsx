'use client'

import { useState } from 'react'
import { Package, Users, Calendar, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/components/ui'

// Mock data - will be replaced with real Supabase data
const mockStats = {
    totalItems: 42,
    availableItems: 28,
    activeReservations: 8,
    pendingReservations: 3,
    activeIncidents: 2,
    totalUsers: 15,
}

const mockPendingReservations = [
    {
        id: '1',
        user_name: 'Juan Pérez',
        start_date: '2025-12-01',
        end_date: '2025-12-03',
        location: 'Picos de Europa',
        items_count: 3,
    },
    {
        id: '2',
        user_name: 'María García',
        start_date: '2025-12-05',
        end_date: '2025-12-07',
        location: 'Montserrat',
        items_count: 2,
    },
]

const mockActiveReservations = [
    {
        id: '3',
        user_name: 'Carlos López',
        start_date: '2025-11-25',
        end_date: '2025-11-28',
        location: 'Sierra Nevada',
        items_count: 4,
        checked_out: true,
    },
]

export default function AdminPage() {
    const stats = [
        {
            title: 'Material Total',
            value: mockStats.totalItems,
            description: `${mockStats.availableItems} disponibles`,
            icon: Package,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Reservas Activas',
            value: mockStats.activeReservations,
            description: 'Material en uso',
            icon: Calendar,
            color: 'from-green-500 to-emerald-500',
        },
        {
            title: 'Pendientes',
            value: mockStats.pendingReservations,
            description: 'Por aprobar',
            icon: TrendingUp,
            color: 'from-amber-500 to-orange-500',
        },
        {
            title: 'Incidencias',
            value: mockStats.activeIncidents,
            description: 'Requieren atención',
            icon: AlertTriangle,
            color: 'from-red-500 to-rose-500',
        },
    ]

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Panel de Administración</h1>
                <p className="text-muted-foreground">
                    Vista general del sistema de gestión de material
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold">{stat.value}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{stat.title}</div>
                                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Reservations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Reservas Pendientes
                        </CardTitle>
                        <CardDescription>Solicitudes esperando aprobación</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockPendingReservations.map((reservation) => (
                                <div
                                    key={reservation.id}
                                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">{reservation.user_name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {reservation.location} • {reservation.items_count} items
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {new Date(reservation.start_date).toLocaleDateString('es-ES')} -{' '}
                                            {new Date(reservation.end_date).toLocaleDateString('es-ES')}
                                        </div>
                                    </div>
                                    <Badge variant="warning">Pendiente</Badge>
                                </div>
                            ))}
                            {mockPendingReservations.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No hay reservas pendientes
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Active Reservations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Reservas Activas
                        </CardTitle>
                        <CardDescription>Material actualmente en uso</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockActiveReservations.map((reservation) => (
                                <div
                                    key={reservation.id}
                                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">{reservation.user_name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {reservation.location} • {reservation.items_count} items
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Hasta {new Date(reservation.end_date).toLocaleDateString('es-ES')}
                                        </div>
                                    </div>
                                    <Badge variant="success">Activa</Badge>
                                </div>
                            ))}
                            {mockActiveReservations.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No hay reservas activas
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
