import { type NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth/session'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    console.log('🔍 Middleware checking path:', pathname)

    const session = await getSessionFromRequest(request)
    console.log('🔐 Session found:', session ? 'YES' : 'NO')
    if (session) {
        console.log('👤 Session user:', session.userId, session.email)
    }

    // Allow access to login and register pages without authentication
    if (
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register')
    ) {
        // If user is already logged in, redirect to home
        if (session) {
            console.log('✅ User logged in, redirecting to home')
            return NextResponse.redirect(new URL('/', request.url))
        }
        console.log('✅ Allowing access to auth page')
        return NextResponse.next()
    }

    // For all other routes, require authentication
    if (!session) {
        console.log('❌ No session, redirecting to login')
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    console.log('✅ Session valid, allowing access')
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
