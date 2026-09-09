/**
 * Returns `target` only when it is a same-origin path, otherwise `fallback`.
 * Rejects absolute and protocol-relative URLs ("//evil.com", "/\evil.com") so a
 * crafted `?from=` cannot turn our login redirect into an open redirect.
 */
export function safeRedirectPath(target: string | null | undefined, fallback: string): string {
    if (!target) return fallback
    if (!target.startsWith('/')) return fallback
    if (target.startsWith('//') || target.startsWith('/\\')) return fallback
    return target
}
