import { type NextRequest, NextResponse } from 'next/server'

import { getSessionFromRequest } from '@/lib/auth/session'
import { locales, defaultLocale } from '@/lib/i18n'

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

// Public marketing pages that should redirect to locale-prefixed versions
const MARKETING_PAGES = ['/', '/features', '/pricing', '/about']

function getLocaleFromHeaders(request: NextRequest): string {
    const acceptLanguage = request.headers.get('accept-language')
    if (!acceptLanguage) return defaultLocale

    const preferred = acceptLanguage
        .split(',')
        .map((lang) => {
            const [code, priority] = lang.trim().split(';q=')
            return { code: code.split('-')[0].toLowerCase(), priority: priority ? parseFloat(priority) : 1 }
        })
        .sort((a, b) => b.priority - a.priority)

    for (const { code } of preferred) {
        if (locales.includes(code as (typeof locales)[number])) {
            return code
        }
    }

    return defaultLocale
}

function isLocalePrefix(pathname: string): boolean {
    return locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow public assets and auth API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/api/organizations') || // Allow organization API calls
        pathname.includes('/favicon.ico') ||
        pathname.includes('/logo') ||
        pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp|txt|xml)$/)
    ) {
        return NextResponse.next()
    }

    // Handle locale-prefixed routes (public marketing pages) - let them through
    if (isLocalePrefix(pathname)) {
        return NextResponse.next()
    }

    // Redirect root path to locale-prefixed version
    if (pathname === '/') {
        const locale = getLocaleFromHeaders(request)
        return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }

    // Redirect non-prefixed marketing pages to locale-prefixed versions
    const isMarketingPage = MARKETING_PAGES.some((p) => p !== '/' && pathname === p)
    if (isMarketingPage) {
        const locale = getLocaleFromHeaders(request)
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
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
