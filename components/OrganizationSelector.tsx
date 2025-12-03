'use client'

// Presentation Layer - Client Component (Mobile First)
// Organization selector dropdown

import { useState, useEffect } from 'react'

interface UserOrganization {
    id: string
    name: string
    slug: string
    role: string
}

export function OrganizationSelector() {
    const [organizations, setOrganizations] = useState<UserOrganization[]>([])
    const [currentOrgId, setCurrentOrgId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [switching, setSwitching] = useState(false)

    useEffect(() => {
        async function loadOrganizations() {
            try {
                const res = await fetch('/api/organizations')
                if (res.ok) {
                    const data = await res.json()
                    // API devuelve { organizations: [...] }
                    setOrganizations(data.organizations || [])
                } else {
                    console.error('Error loading organizations:', res.statusText)
                    setOrganizations([])
                }
            } catch (error) {
                console.error('Error fetching organizations:', error)
                setOrganizations([])
            } finally {
                setLoading(false)
            }
        }

        async function loadCurrentOrg() {
            try {
                const res = await fetch('/api/organizations/switch')
                if (res.ok) {
                    const data = await res.json()
                    setCurrentOrgId(data.organizationId)
                }
            } catch (error) {
                console.error('Error fetching current org:', error)
            }
        }

        loadOrganizations()
        loadCurrentOrg()
    }, [])

    async function handleSwitch(orgId: string) {
        if (orgId === currentOrgId) return

        setSwitching(true)
        try {
            const response = await fetch('/api/organizations/switch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ organizationId: orgId }),
            })

            if (response.ok) {
                setCurrentOrgId(orgId)
                // Reload page to refresh all data with new organization context
                window.location.reload()
            } else {
                const error = await response.json()
                console.error('Failed to switch organization:', error)
                alert('No se pudo cambiar de organización')
            }
        } catch (error) {
            console.error('Error switching organization:', error)
            alert('Error al cambiar de organización')
        } finally {
            setSwitching(false)
        }
    }

    if (loading) {
        return (
            <div className="w-full md:w-48 px-3 py-2 text-sm text-muted-foreground">
                Cargando...
            </div>
        )
    }

    if (organizations.length === 0) {
        return (
            <div className="w-full md:w-48 px-3 py-2 text-sm text-muted-foreground">
                Sin organizaciones
            </div>
        )
    }

    // Auto-select first organization if none selected
    if (!currentOrgId && organizations.length > 0) {
        handleSwitch(organizations[0].id)
    }

    const currentOrg = organizations.find(org => org.id === currentOrgId)

    return (
        <div className="w-full md:w-auto">
            <select
                value={currentOrgId || ''}
                onChange={(e) => handleSwitch(e.target.value)}
                disabled={switching}
                className="w-full md:w-auto px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                        {org.name} ({org.role})
                    </option>
                ))}
            </select>
            {switching && (
                <div className="mt-1 text-xs text-muted-foreground">
                    Cambiando organización...
                </div>
            )}
        </div>
    )
}
