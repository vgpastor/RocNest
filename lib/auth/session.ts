import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import type { SessionPayload } from './types'

// CRITICAL: JWT_SECRET must be defined in environment variables
if (!process.env.JWT_SECRET) {
    throw new Error(
        'JWT_SECRET is not defined in environment variables. ' +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
    )
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
const COOKIE_NAME = 'session'

export async function createSession(userId: string, email: string, organizationIds: string[] = []): Promise<string> {
    const expiresAt = new Date(Date.now() + SESSION_DURATION)

    const token = await new SignJWT({ userId, email, organizationIds })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expiresAt)
        .setIssuedAt()
        .sign(SECRET_KEY)

    return token
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY)
        return payload as unknown as SessionPayload
    } catch {
        return null
    }
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) return null

    return verifySession(token)
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token) return null

    return verifySession(token)
}

/** The session cookie is described once: every writer reuses these attributes. */
function sessionCookie(token: string) {
    return {
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: SESSION_DURATION / 1000, // Convert to seconds
        path: '/',
    }
}

export function setSessionCookie(response: NextResponse, token: string) {
    response.cookies.set(sessionCookie(token))
}

export function deleteSessionCookie(response: NextResponse) {
    response.cookies.delete(COOKIE_NAME)
}

/**
 * Get current session user (convenience function for server components)
 * Returns { userId, email } or null if no session
 */
export async function getSessionUser(): Promise<{ userId: string; email: string } | null> {
    const session = await getSession()
    if (!session) return null

    return {
        userId: session.userId,
        email: session.email
    }
}

/**
 * Re-issues the session cookie with up-to-date organization IDs.
 * Only callable from Server Actions or Route Handlers (cookies are read-only while rendering).
 * Needed after joining an organization: the middleware validates the active organization
 * against the IDs baked into the JWT, so a stale token locks the user out.
 */
export async function refreshSessionCookie(
    userId: string,
    email: string,
    organizationIds: string[]
): Promise<void> {
    const token = await createSession(userId, email, organizationIds)
    const cookieStore = await cookies()

    cookieStore.set(sessionCookie(token))
}
