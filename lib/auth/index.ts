// Auth Module - Central export point following Dependency Inversion Principle
// Consumers depend on abstractions (interfaces), not concrete implementations

// Export interfaces and types
export * from './interfaces'
export * from './types'

// Export services
export * from './services/AuthService'

// Export utilities
export * from './session'
export * from './password'

// Singleton instance of AuthService
// Following Dependency Inversion - consumers get the interface, not the implementation
import { AuthService } from './services/AuthService'

/**
 * Global auth service instance
 * Use this in API routes and server components
 * 
 * @example
 * ```typescript
 * import { authService } from '@/lib/auth'
 * 
 * const user = await authService.requireAuth()
 * ```
 */
export const authService = new AuthService()
