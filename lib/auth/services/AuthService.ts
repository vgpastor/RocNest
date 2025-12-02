// Auth Service - Following Single Responsibility Principle
// This service is responsible ONLY for authentication operations

import type { IAuthService, AuthUser } from '../interfaces'
import { getSessionUser } from '../session'

/**
 * Custom error for authentication failures
 */
export class AuthenticationError extends Error {
    constructor(message: string = 'Usuario no autenticado') {
        super(message)
        this.name = 'AuthenticationError'
    }
}

/**
 * Authentication Service Implementation
 * Provides a clean, testable interface for authentication
 */
export class AuthService implements IAuthService {
    /**
     * Get the currently authenticated user
     * Returns null if no valid session exists
     */
    async getCurrentUser(): Promise<AuthUser | null> {
        return await getSessionUser()
    }

    /**
     * Require authentication - throws if user is not authenticated
     * Use this in API routes where authentication is mandatory
     * @throws AuthenticationError if user is not authenticated
     */
    async requireAuth(): Promise<AuthUser> {
        const user = await this.getCurrentUser()

        if (!user) {
            throw new AuthenticationError()
        }

        return user
    }
}
