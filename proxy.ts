import { type NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth/session'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    '/login',
    '/register',
]

// Routes that should redirect to app if already authenticated
const AUTH_ROUTES = ['/login', '/register']

// Routes related to organization management that don't require an active organization
const ORGANIZATION_MANAGEMENT_ROUTES = [
    '/organizations/select',
    '/organizations/create',
    '/invitations/accept',
]

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow public assets and auth API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/api/organizations') || // Allow organization API calls
        pathname.includes('/favicon.ico') ||
        pathname.includes('/logo') ||
        pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp)$/)
    ) {
        return NextResponse.next()
    }

    // Check if route is public or organization management
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
    const isOrgManagementRoute = ORGANIZATION_MANAGEMENT_ROUTES.some(route => pathname.startsWith(route))

    // Get session
    const session = await getSessionFromRequest(request)

    // If user is authenticated and trying to access auth pages, redirect to app
    if (session && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // If route requires authentication and user is not authenticated
    if (!session && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If user is authenticated, validate organization context
    // (Only for routes that are not public and not organization management)
    if (session && !isPublicRoute && !isOrgManagementRoute) {
        // Check if user has any organizations in their session
        const hasOrganizations = session.organizationIds && session.organizationIds.length > 0

        if (!hasOrganizations) {
            // User has no organizations → redirect to create/join one
            return NextResponse.redirect(new URL('/organizations/select', request.url))
        }

        // Check if there's a current organization selected
        const currentOrgId = request.cookies.get('current-organization')?.value

        if (!currentOrgId) {
            // No organization selected → redirect to select
            return NextResponse.redirect(new URL('/organizations/select', request.url))
        }

        // Validate that the selected organization is in the user's organizations (from JWT)
        const isValidOrg = session.organizationIds.includes(currentOrgId)

        if (!isValidOrg) {
            // Cookie has an invalid organization → clear cookie and redirect
            const response = NextResponse.redirect(new URL('/organizations/select', request.url))
            response.cookies.delete('current-organization')
            return response
        }
    }

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
