// Auth Interfaces - Following Interface Segregation Principle
// Each interface has a single, focused responsibility

/**
 * Core authentication user type
 * Represents the minimal authenticated user data
 */
export type IAuthUser = {
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
     * @returns IAuthUser if authenticated, null otherwise
     */
    getCurrentUser(): Promise<IAuthUser | null>

    /**
     * Require authentication - throws if not authenticated
     * @throws AuthenticationError if user is not authenticated
     * @returns IAuthUser
     */
    requireAuth(): Promise<IAuthUser>
}

/**
 * Session Service Interface
 * Handles session token operations
 */
export interface ISessionService {
    /**
     * Get the current session payload
     * @returns ISessionPayload if valid session exists, null otherwise
     */
    getSession(): Promise<ISessionPayload | null>

    /**
     * Get simplified session user data
     * @returns Simplified user data or null
     */
    getSessionUser(): Promise<IAuthUser | null>
}

/**
 * Session payload from JWT
 */
export type ISessionPayload = {
    userId: string
    email: string
    exp: number
    iat?: number
}
