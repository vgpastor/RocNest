import { CheckCircle2 } from 'lucide-react'
import { redirect } from 'next/navigation'

import { Logo } from '@/components'
import { getSessionUser } from '@/lib/auth/session'

import { CreateOrganizationForm } from './CreateOrganizationForm'

interface CreateOrganizationPageProps {
    searchParams: Promise<{ welcome?: string }>
}

export default async function CreateOrganizationPage({ searchParams }: CreateOrganizationPageProps) {
    const session = await getSessionUser()

    if (!session) {
        redirect('/login')
    }

    const params = await searchParams
    const isWelcome = params.welcome === 'true'

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)]">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        <Logo size={64} />
                    </div>
                    {isWelcome ? (
                        <>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] text-sm font-medium mb-4">
                                <CheckCircle2 className="h-4 w-4" />
                                ¡Cuenta creada con éxito!
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                ¡Bienvenido a RocNest! 🎉
                            </h1>
                            <p className="text-base sm:text-lg text-[var(--color-muted-foreground)] max-w-xl mx-auto">
                                Solo falta un paso: crea tu primera organización y comienza a gestionar el material de tu club en segundos.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                Crea una Nueva Organización
                            </h1>
                            <p className="text-base sm:text-lg text-[var(--color-muted-foreground)]">
                                Configura tu espacio de trabajo para gestionar inventario y reservas
                            </p>
                        </>
                    )}
                </div>

                {/* Form Card */}
                <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl">
                    <CreateOrganizationForm userId={session.userId} isWelcome={isWelcome} />
                </div>

                {/* Info Cards */}
                {isWelcome && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
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
                )}
            </div>
        </div>
    )
}
