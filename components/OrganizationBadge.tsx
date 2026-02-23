'use client'

// Presentation Layer - Organization Badge
// Shows current organization info (read-only display)

import { useEffect, useState } from 'react'

interface CurrentOrganization {
    id: string
    name: string
    role: string
}

export function OrganizationBadge() {
    const [organization, setOrganization] = useState<CurrentOrganization | null>(null)

    useEffect(() => {
        async function fetchCurrentOrganization() {
            try {
                const [currentResponse, orgsResponse] = await Promise.all([
                    fetch('/api/organizations/current'),
                    fetch('/api/organizations'),
                ])

                if (currentResponse.ok && orgsResponse.ok) {
                    const { organizationId } = await currentResponse.json()
                    const { organizations } = await orgsResponse.json()

                    const current = organizations.find((org: any) => org.id === organizationId)
                    if (current) {
                        setOrganization(current)
                    }
                }
            } catch (error) {
                console.error('Error fetching organization:', error)
            }
        }
        fetchCurrentOrganization()
    }, [])

    if (!organization) {
        return null
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">{organization.name}</span>
            </div>
        </div>
    )
}
