import { NextRequest, NextResponse } from 'next/server'

import { getSessionFromRequest } from '@/lib/auth/session'

const PUBLIC_PATHS = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
]

function isPublicPath(pathname: string): boolean {
    if (PUBLIC_PATHS.includes(pathname)) return true
    // Static files and Next.js internals
    if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/icon') || pathname.startsWith('/apple-icon')) return true
    // Public pages (landing, locale pages)
    if (pathname === '/' || pathname.match(/^\/(es|en)(\/|$)/)) return true
    // Public assets
    if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|woff2?)$/)) return true
    return false
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip public paths
    if (isPublicPath(pathname)) {
        return NextResponse.next()
    }

    // Check auth for protected routes (app pages and API routes)
    const isAppRoute = pathname.startsWith('/catalog') ||
        pathname.startsWith('/configuration') ||
        pathname.startsWith('/reservations') ||
        pathname.startsWith('/organizations') ||
        pathname.startsWith('/invitations') ||
        pathname.startsWith('/design-system') ||
        pathname === '/dashboard'

    const isProtectedApi = pathname.startsWith('/api/') && !PUBLIC_PATHS.includes(pathname)

    if (isAppRoute || isProtectedApi) {
        const session = await getSessionFromRequest(request)

        if (!session) {
            if (isProtectedApi) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            const loginUrl = new URL('/api/auth/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, icon.png, apple-icon.png (metadata files)
         */
        '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)',
    ],
}
