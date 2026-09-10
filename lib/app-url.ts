import { isLoopbackUrl } from './site-url'

/**
 * Absolute base URL for links we put in emails.
 *
 * Prefers NEXT_PUBLIC_APP_URL; otherwise derives it from the request. Proxy headers
 * can carry a comma-separated chain ("https,http"), so only the first hop is used.
 *
 * A loopback value is ignored in production: an invitation email whose links point
 * at localhost is worse than one derived from the request headers.
 */
export function resolveAppUrl(request: Request): string {
    const configured = process.env.NEXT_PUBLIC_APP_URL?.trim()
    const isProduction = process.env.NODE_ENV === 'production'
    if (configured && !(isProduction && isLoopbackUrl(configured))) {
        return configured.replace(/\/+$/, '')
    }

    const firstHop = (value: string | null) => value?.split(',')[0]?.trim() || null

    const protocol = firstHop(request.headers.get('x-forwarded-proto')) ?? 'http'
    const host =
        firstHop(request.headers.get('x-forwarded-host')) ??
        firstHop(request.headers.get('host')) ??
        'localhost:3000'

    return `${protocol}://${host}`
}
