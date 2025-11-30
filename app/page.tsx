import {
  TrendingUp,
  Users,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch metrics
  const { count: activeReservationsCount } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .in('status', ['approved', 'active']);

  const { count: itemsInUseCount } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rented');

  const { count: totalUsersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: stockAlertsCount } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .in('status', ['maintenance', 'lost']);

  // Fetch recent activity (last 5 reservations)
  const { data: recentActivity } = await supabase
    .from('reservations')
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido de nuevo, aquí tienes el resumen de hoy.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            Descargar Reporte
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid-dashboard">
        {[
          { label: "Reservas Activas", value: activeReservationsCount || 0, change: "+12%", trend: "up", icon: Clock },
          { label: "Material en Uso", value: itemsInUseCount || 0, change: "+5%", trend: "up", icon: Package },
          { label: "Usuarios Totales", value: totalUsersCount || 0, change: "+2%", trend: "up", icon: Users },
          { label: "Alertas Stock", value: stockAlertsCount || 0, change: "Requiere atención", trend: "neutral", icon: AlertCircle },
        ].map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              {/* Trends are still mocked for now as they require historical data */}
              {stat.trend === 'up' && <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><ArrowUpRight className="h-3 w-3 mr-1" />{stat.change}</span>}
              {stat.trend === 'down' && <span className="flex items-center text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full"><ArrowDownRight className="h-3 w-3 mr-1" />{stat.change}</span>}
              {stat.trend === 'neutral' && <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{stat.change}</span>}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold tracking-tight mt-1">{stat.value}</h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <div className="col-span-4 rounded-xl border bg-card shadow-sm">
          <div className="p-6 border-b">
            <h3 className="font-semibold">Actividad Reciente</h3>
            <p className="text-sm text-muted-foreground">Últimas reservas realizadas</p>
          </div>
          <div className="p-6">
            <div className="space-y-8">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity: any, i) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.profiles?.full_name || activity.profiles?.email || 'Usuario'} ha creado una reserva
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()} - {activity.location}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-primary">
                      Ver detalles
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No hay actividad reciente</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="col-span-3 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="font-semibold mb-4">Estado del Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Servidor</span>
                <span className="flex items-center text-emerald-600"><div className="h-2 w-2 rounded-full bg-emerald-500 mr-2" /> Operativo</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Base de Datos</span>
                <span className="flex items-center text-emerald-600"><div className="h-2 w-2 rounded-full bg-emerald-500 mr-2" /> Conectado</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Externa</span>
                <span className="flex items-center text-amber-600"><div className="h-2 w-2 rounded-full bg-amber-500 mr-2" /> Latencia Alta</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white shadow-lg">
            <h3 className="font-semibold text-lg mb-2">Plan Premium</h3>
            <p className="text-indigo-100 text-sm mb-4">Desbloquea todas las funcionalidades avanzadas para tu equipo.</p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
              Actualizar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
