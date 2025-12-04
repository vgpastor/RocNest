import { redirect } from 'next/navigation'

import { Logo } from '@/components'
import { getSessionUser } from '@/lib/auth/session'

import { CreateOrganizationForm } from './CreateOrganizationForm'

export default async function CreateOrganizationPage() {
    const session = await getSessionUser()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)]">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        <Logo size={64} />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Crea tu Organización
                    </h1>
                    <p className="text-lg text-[var(--color-muted-foreground)]">
                        Configura tu espacio de trabajo para gestionar inventario y reservas
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-panel rounded-2xl p-8 shadow-xl">
                    <CreateOrganizationForm userId={session.userId} />
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">📦</div>
                        <h3 className="font-semibold mb-1">Gestión de Inventario</h3>
                        <p className="text-sm text-[var(--color-muted-foreground)]">
                            Control total de tu material
                        </p>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">📅</div>
                        <h3 className="font-semibold mb-1">Reservas Simplificadas</h3>
                        <p className="text-sm text-[var(--color-muted-foreground)]">
                            Gestiona préstamos fácilmente
                        </p>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">👥</div>
                        <h3 className="font-semibold mb-1">Colaboración</h3>
                        <p className="text-sm text-[var(--color-muted-foreground)]">
                            Invita a tu equipo
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
