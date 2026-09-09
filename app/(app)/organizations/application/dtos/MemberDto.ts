// Application Layer - DTOs
// Value objects never cross the HTTP boundary: they are flattened here.

import type { Invitation, Membership } from '../../domain/types'

export interface MemberDto {
    id: string
    userId: string
    role: string
    joinedAt: string
    user: {
        id: string
        email: string
        fullName: string | null
    }
}

export interface InvitationDto {
    id: string
    email: string
    role: string
    expiresAt: string
    organization: { id: string; name: string }
}

export function toMemberDto(membership: Membership): MemberDto {
    return {
        id: membership.id,
        userId: membership.userId,
        role: membership.role.value,
        joinedAt: membership.joinedAt.toISOString(),
        user: membership.user,
    }
}

export function toInvitationDto(invitation: Invitation): InvitationDto {
    return {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role.value,
        expiresAt: invitation.expiresAt.toISOString(),
        organization: invitation.organization,
    }
}
