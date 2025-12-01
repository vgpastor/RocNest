// Auth Types
export interface SessionPayload {
    userId: string
    email: string
    exp: number
}

export interface AuthUser {
    id: string
    email: string
    fullName: string | null
    organizations: UserOrganization[]
}

export interface UserOrganization {
    id: string
    organizationId: string
    role: string
    organization: {
        id: string
        name: string
        slug: string
    }
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    fullName: string
}

export interface AuthResponse {
    user: AuthUser
    message?: string
}

export interface ErrorResponse {
    error: string
}
