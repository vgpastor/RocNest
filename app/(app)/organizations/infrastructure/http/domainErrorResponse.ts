// Infrastructure Layer - Maps domain errors to HTTP responses.
// Keeps the API routes free of status-code branching.

import { NextResponse } from 'next/server'

import { AuthenticationError } from '@/lib/auth'
import { DomainError } from '@/lib/domain/DomainError'

import {
    AlreadyOrganizationMemberError,
    InsufficientPermissionsError,
    InvalidOrganizationRoleError,
    InvitationAlreadyAcceptedError,
    InvitationEmailRequiredError,
    InvitationExpiredError,
    InvitationNotFoundError,
    LastAdministratorError,
    MemberNotFoundError,
    NotOrganizationMemberError,
} from '../../domain/errors/OrganizationErrors'

const STATUS_BY_ERROR: ReadonlyArray<[new (...args: never[]) => DomainError, number]> = [
    [InvalidOrganizationRoleError, 400],
    [InvitationEmailRequiredError, 400],
    [LastAdministratorError, 400],
    [NotOrganizationMemberError, 403],
    [InsufficientPermissionsError, 403],
    [MemberNotFoundError, 404],
    [InvitationNotFoundError, 404],
    [InvitationExpiredError, 410],
    [InvitationAlreadyAcceptedError, 409],
    [AlreadyOrganizationMemberError, 409],
]

/**
 * Translates an error into a response. Anything unexpected is logged and reported
 * as a 500 with `fallbackMessage`, so internals never leak to the client.
 */
export function domainErrorResponse(error: unknown, fallbackMessage: string): NextResponse {
    if (error instanceof AuthenticationError) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    if (error instanceof DomainError) {
        const match = STATUS_BY_ERROR.find(([type]) => error instanceof type)
        return NextResponse.json({ error: error.message }, { status: match ? match[1] : 400 })
    }

    console.error(fallbackMessage, error)
    return NextResponse.json({ error: fallbackMessage }, { status: 500 })
}
