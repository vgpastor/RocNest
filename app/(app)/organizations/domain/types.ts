// Domain Layer - Organization bounded context types

import type { OrganizationRole } from './value-objects/OrganizationRole'

export interface OrganizationSummary {
    id: string
    name: string
}

export interface MemberProfile {
    id: string
    email: string
    fullName: string | null
}

export interface Membership {
    id: string
    userId: string
    role: OrganizationRole
    joinedAt: Date
    user: MemberProfile
}

export interface Invitation {
    id: string
    token: string
    email: string
    role: OrganizationRole
    organization: OrganizationSummary
    inviter: MemberProfile
    expiresAt: Date
    acceptedAt: Date | null
}

export interface NewInvitation {
    organizationId: string
    email: string
    role: OrganizationRole
    invitedBy: string
    expiresAt: Date
}
