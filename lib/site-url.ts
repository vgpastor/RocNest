/**
 * Canonical absolute URL of the public site.
 *
 * Every SEO surface (canonical links, hreflang, sitemap, robots, Open Graph and
 * JSON-LD) has to agree on a single origin, so it is resolved once here instead
 * of being rebuilt as `process.env.X || '...'` at every call site.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_BASE_URL, unless it points at a loopback address in production.
 *   2. The Vercel production domain, when the build runs on Vercel.
 *   3. https://rocnest.app in production, http://localhost:<port> otherwise.
 *
 * The loopback guard is not defensive programming for its own sake: `.env` is
 * versioned and Next also loads it during production builds, so a stray
 * localhost value there would otherwise ship as the canonical URL of every page.
 */

const PRODUCTION_SITE_URL = 'https://rocnest.app'
const DEFAULT_DEVELOPMENT_PORT = '3000'

const LOOPBACK_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

export type SiteUrlEnvironment = {
    /** Explicit override, from NEXT_PUBLIC_BASE_URL. */
    configuredUrl?: string
    /** Bare production domain injected by Vercel, without protocol. */
    vercelProductionDomain?: string
    isProduction: boolean
    port?: string
}

function withoutTrailingSlash(url: string): string {
    return url.replace(/\/+$/, '')
}

export function isLoopbackUrl(url: string): boolean {
    try {
        return LOOPBACK_HOSTNAMES.has(new URL(url).hostname)
    } catch {
        return false
    }
}

export function resolveSiteUrl(environment: SiteUrlEnvironment): string {
    const { configuredUrl, vercelProductionDomain, isProduction, port } = environment

    const configured = configuredUrl?.trim()
    if (configured && !(isProduction && isLoopbackUrl(configured))) {
        return withoutTrailingSlash(configured)
    }

    if (isProduction) {
        const vercelDomain = vercelProductionDomain?.trim()
        return vercelDomain
            ? `https://${withoutTrailingSlash(vercelDomain)}`
            : PRODUCTION_SITE_URL
    }

    return `http://localhost:${port?.trim() || DEFAULT_DEVELOPMENT_PORT}`
}

export const siteUrl = resolveSiteUrl({
    configuredUrl: process.env.NEXT_PUBLIC_BASE_URL,
    vercelProductionDomain: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT,
})

/** Absolute URL for a site-relative path, e.g. absoluteUrl('/es/pricing'). */
export function absoluteUrl(path = ''): string {
    if (!path || path === '/') return siteUrl
    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
