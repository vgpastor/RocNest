import { describe, expect, it } from 'vitest'

import { absoluteUrl, isLoopbackUrl, resolveSiteUrl } from '../site-url'

describe('isLoopbackUrl', () => {
    it.each([
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://[::1]:3000',
        'https://localhost',
    ])('recognises %s as loopback', (url) => {
        expect(isLoopbackUrl(url)).toBe(true)
    })

    it.each(['https://rocnest.app', 'https://localhost.rocnest.app', 'not-a-url'])(
        'does not treat %s as loopback',
        (url) => {
            expect(isLoopbackUrl(url)).toBe(false)
        },
    )
})

describe('resolveSiteUrl', () => {
    it('uses the configured URL in production', () => {
        expect(
            resolveSiteUrl({ configuredUrl: 'https://rocnest.app', isProduction: true }),
        ).toBe('https://rocnest.app')
    })

    it('strips trailing slashes', () => {
        expect(
            resolveSiteUrl({ configuredUrl: 'https://rocnest.app///', isProduction: true }),
        ).toBe('https://rocnest.app')
    })

    // The regression this module exists for: a versioned .env leaking localhost
    // into a production build used to become the canonical URL of every page.
    it('ignores a loopback URL in production', () => {
        expect(
            resolveSiteUrl({ configuredUrl: 'http://localhost:3000', isProduction: true }),
        ).toBe('https://rocnest.app')
    })

    it('falls back to the Vercel production domain when nothing is configured', () => {
        expect(
            resolveSiteUrl({
                configuredUrl: '  ',
                vercelProductionDomain: 'rocnest.vercel.app',
                isProduction: true,
            }),
        ).toBe('https://rocnest.vercel.app')
    })

    it('honours a loopback URL outside production', () => {
        expect(
            resolveSiteUrl({ configuredUrl: 'http://localhost:4000', isProduction: false }),
        ).toBe('http://localhost:4000')
    })

    it('defaults to localhost outside production', () => {
        expect(resolveSiteUrl({ isProduction: false })).toBe('http://localhost:3000')
        expect(resolveSiteUrl({ isProduction: false, port: '4321' })).toBe(
            'http://localhost:4321',
        )
    })
})

describe('absoluteUrl', () => {
    it('joins paths onto the resolved site URL', () => {
        expect(absoluteUrl('/es/pricing')).toMatch(/\/es\/pricing$/)
        expect(absoluteUrl('es/pricing')).toBe(absoluteUrl('/es/pricing'))
    })

    it('returns the bare site URL for the root path', () => {
        expect(absoluteUrl('/')).toBe(absoluteUrl())
        expect(absoluteUrl()).not.toMatch(/\/$/)
    })
})
