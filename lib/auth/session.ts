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
    } catch (_error) {
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

export function setSessionCookie(response: NextResponse, token: string) {
    response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION / 1000, // Convert to seconds
        path: '/',
    })
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
