// Auth Interfaces - Following Interface Segregation Principle
// Each interface has a single, focused responsibility

/**
 * Core authentication user type
 * Represents the minimal authenticated user data
 */
export type AuthUser = {
    userId: string
    email: string
}

/**
 * Authentication Service Interface
 * Handles user authentication operations
 */
export interface IAuthService {
    /**
     * Get the currently authenticated user
     * @returns AuthUser if authenticated, null otherwise
     */
    getCurrentUser(): Promise<AuthUser | null>

    /**
     * Require authentication - throws if not authenticated
     * @throws AuthenticationError if user is not authenticated
     * @returns AuthUser
     */
    requireAuth(): Promise<AuthUser>
}

/**
 * Session Service Interface
 * Handles session token operations
 */
export interface ISessionService {
    /**
     * Get the current session payload
     * @returns SessionPayload if valid session exists, null otherwise
     */
    getSession(): Promise<SessionPayload | null>

    /**
     * Get simplified session user data
     * @returns Simplified user data or null
     */
    getSessionUser(): Promise<AuthUser | null>
}

/**
 * Session payload from JWT
 */
export type SessionPayload = {
    userId: string
    email: string
    exp: number
    iat?: number
}
