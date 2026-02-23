'use client'

import { Building2, Plus, CheckCircle2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Organization {
    id: string
    organizationId: string
    organization: {
        id: string
        name: string
        slug: string
        description: string | null
        logoUrl: string | null
    }
}

interface OrganizationSelectorProps {
    organizations: Organization[]
    userId: string
}

export function OrganizationSelector({ organizations, userId: _userId }: OrganizationSelectorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState<string | null>(null)

    const handleSelectOrganization = async (organizationId: string) => {
        setLoading(true)
        setSelectedOrg(organizationId)

        try {
            const response = await fetch('/api/organizations/switch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ organizationId }),
            })

            if (!response.ok) {
                throw new Error('Error al cambiar de organización')
            }

            // Redirect to home after successful switch
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Error selecting organization:', error)
            alert('Error al seleccionar la organización')
            setLoading(false)
            setSelectedOrg(null)
        }
    }

    const handleCreateOrganization = () => {
        router.push('/organizations/create')
    }

    if (organizations.length === 0) {
        return (
            <div className="text-center space-y-6">
                <div className="glass-panel rounded-2xl p-12 shadow-xl">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary-subtle)] mb-6">
                        <Building2 className="w-10 h-10 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                        No tienes organizaciones
                    </h3>
                    <p className="text-[var(--color-muted-foreground)] mb-8 max-w-md mx-auto">
                        Para comenzar a usar la aplicación, necesitas crear una organización
                        o ser invitado a una existente.
                    </p>
                    <button
                        onClick={handleCreateOrganization}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-primary-foreground)] rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Crear mi primera organización
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizations.map((userOrg) => {
                    const org = userOrg.organization
                    const isSelected = selectedOrg === org.id
                    const isLoading = loading && isSelected

                    return (
                        <button
                            key={org.id}
                            onClick={() => handleSelectOrganization(org.id)}
                            disabled={loading}
                            className={`
                                group relative p-6 rounded-xl transition-all text-left
                                ${isLoading
                                    ? 'glass-panel scale-[1.02] shadow-xl'
                                    : 'glass hover:scale-[1.02] hover:shadow-lg'
                                }
                                ${loading && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <div className="flex items-start gap-4">
                                {org.logoUrl ? (
                                    <Image
                                        src={org.logoUrl}
                                        alt={org.name}
                                        width={56}
                                        height={56}
                                        className="rounded-xl object-cover ring-2 ring-[var(--color-border)]"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-md">
                                        <Building2 className="w-7 h-7 text-[var(--color-primary-foreground)]" />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg mb-1 truncate">
                                        {org.name}
                                    </h3>
                                    {org.description && (
                                        <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mb-2">
                                            {org.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-[var(--color-muted-foreground)] font-mono">
                                        @{org.slug}
                                    </p>
                                </div>

                                <div className="flex-shrink-0">
                                    {isLoading ? (
                                        <CheckCircle2 className="w-6 h-6 text-[var(--color-success)] animate-pulse" />
                                    ) : (
                                        <ArrowRight className="w-5 h-5 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                                    )}
                                </div>
                            </div>

                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </button>
                    )
                })}
            </div>

            <div className="text-center pt-4">
                <button
                    onClick={handleCreateOrganization}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 glass-panel rounded-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    Crear nueva organización
                </button>
            </div>
        </div>
    )
}
