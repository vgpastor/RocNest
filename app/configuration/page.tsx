import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentOrganizationId } from '@/lib/organization-helpers'
import { prisma } from '@/lib/prisma'
import { Users, Settings, Building2 } from 'lucide-react'
import MembersTab from './MembersTab'
import OrganizationTab from './OrganizationTab'

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const organizationId = await getCurrentOrganizationId()

    if (!organizationId) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Selecciona una organización</h2>
                    <p className="text-muted-foreground">
                        Por favor selecciona una organización para acceder al panel de administración
                    </p>
                </div>
            </div>
        )
    }

    // Verify user is admin or owner
    const membership = await prisma.userOrganization.findUnique({
        where: {
            userId_organizationId: {
                userId: user.id,
                organizationId
            }
        }
    })

    if (!membership || membership.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
                    <p className="text-muted-foreground">
                        Solo los administradores pueden acceder a esta página
                    </p>
                </div>
            </div>
        )
    }

    // Get organization details
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId }
    })

    if (!organization) {
        redirect('/dashboard')
    }

    const { tab } = await searchParams
    const currentTab = tab || 'members'

    const tabs = [
        { id: 'members', label: 'Miembros', icon: Users },
        { id: 'organization', label: 'Organización', icon: Building2 },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Administración</h1>
                <p className="text-muted-foreground mt-1">
                    Gestiona tu organización y sus miembros
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <div className="flex gap-6">
                    {tabs.map((tabItem) => {
                        const Icon = tabItem.icon
                        const isActive = currentTab === tabItem.id

                        return (
                            <a
                                key={tabItem.id}
                                href={`/configuration?tab=${tabItem.id}`}
                                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium transition-colors ${isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tabItem.label}
                            </a>
                        )
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="py-4">
                {currentTab === 'members' && (
                    <MembersTab organizationId={organizationId} currentUserId={user.id} />
                )}
                {currentTab === 'organization' && (
                    <OrganizationTab organization={organization} />
                )}
            </div>
        </div>
    )
}
