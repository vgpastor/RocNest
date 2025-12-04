import {
  Clock,
  Package,
  Users,
  AlertCircle,
} from "lucide-react";

import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { PageHeader, MetricCard, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, EmptyState, Badge } from "@/components";
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Authentication is handled by middleware - no need to check here
  const sessionUser = await getSessionUser()

  // Obtener organización actual
  const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId)

  // Mostrar mensaje si no hay organización seleccionada
  if (!organizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="Selecciona una organización"
          description="Por favor selecciona una organización para ver el dashboard"
        />
      </div>
    )
  }

  // Fetch metrics usando Prisma
  const activeReservationsCount = await prisma.reservation.count({
    where: {
      organizationId,
      status: { in: ['approved', 'active'] }
    }
  });

  const itemsInUseCount = await prisma.item.count({
    where: {
      organizationId,
      status: 'rented'
    }
  });

  // Total de usuarios en la organización
  const totalUsersCount = await prisma.userOrganization.count({
    where: { organizationId }
  });

  const stockAlertsCount = await prisma.item.count({
    where: {
      organizationId,
      status: { in: ['maintenance', 'lost'] }
    }
  });

  interface RecentActivity {
    id: string;
    createdAt: Date;
    purpose: string | null;
    status: string;
    responsibleUser: {
      fullName: string | null;
      email: string;
    };
  }

  // Fetch recent activity (últimas 5 reservas)
  const recentActivity = await prisma.reservation.findMany({
    where: { organizationId },
    include: {
      responsibleUser: {
        select: {
          fullName: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  }) as unknown as RecentActivity[];

  const metrics = [
    {
      title: "Reservas Activas",
      value: activeReservationsCount,
      change: { value: 12, label: 'esta semana' },
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: "Material en Uso",
      value: itemsInUseCount,
      change: { value: 5, label: 'esta semana' },
      icon: <Package className="h-5 w-5" />
    },
    {
      title: "Usuarios Totales",
      value: totalUsersCount,
      change: { value: 2, label: 'este mes' },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Alertas Stock",
      value: stockAlertsCount,
      change: stockAlertsCount > 0 ? { value: -100, label: 'requiere atención' } : undefined,
      icon: <AlertCircle className="h-5 w-5" />
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Bienvenido de nuevo, aquí tienes el resumen de hoy."
        action={
          <div className="flex gap-2">
            <Button variant="outline">Descargar Reporte</Button>
            <Button variant="primary">Nueva Reserva</Button>
          </div>
        }
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <MetricCard
            key={i}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card hover className="col-span-4">
          <CardHeader className="border-b border-[var(--color-border)]">
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas reservas realizadas</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center border border-[var(--color-border)]">
                      <Users className="h-4 w-4 text-[var(--color-primary)]" />
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.responsibleUser?.fullName || activity.responsibleUser?.email || 'Usuario'} ha creado una reserva
                      </p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">
                        {new Date(activity.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })} - {activity.purpose || 'Sin propósito especificado'}
                      </p>
                    </div>
                    <Badge variant="success" size="sm">
                      {activity.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-[var(--color-muted-foreground)]">No hay actividad reciente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Status */}
        <div className="col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-muted-foreground)]">Servidor</span>
                <span className="flex items-center text-[var(--color-success)]">
                  <div className="h-2 w-2 rounded-full bg-[var(--color-success)] mr-2" />
                  Operativo
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-muted-foreground)]">Base de Datos</span>
                <span className="flex items-center text-[var(--color-success)]">
                  <div className="h-2 w-2 rounded-full bg-[var(--color-success)] mr-2" />
                  Conectado
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-muted-foreground)]">Prisma ORM</span>
                <span className="flex items-center text-[var(--color-success)]">
                  <div className="h-2 w-2 rounded-full bg-[var(--color-success)] mr-2" />
                  Activo
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] p-6 text-white shadow-lg">
            <h3 className="font-semibold text-lg mb-2">Plan Premium</h3>
            <p className="text-[var(--color-primary-foreground)]/90 text-sm mb-4">
              Desbloquea todas las funcionalidades avanzadas para tu equipo.
            </p>
            <Button variant="secondary" className="w-full bg-white text-[var(--color-primary)] hover:bg-white/90">
              Actualizar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
