import { describe, it, expect, afterEach } from 'vitest'

import { resolveAppUrl } from '../app-url'

function requestWith(headers: Record<string, string>) {
    return new Request('http://internal/api', { headers })
}

afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL
})

describe('resolveAppUrl', () => {
    it('prefers NEXT_PUBLIC_APP_URL and trims trailing slashes', () => {
        process.env.NEXT_PUBLIC_APP_URL = 'https://rocnest.app/'
        expect(resolveAppUrl(requestWith({ host: 'ignored' }))).toBe('https://rocnest.app')
    })

    it('derives the URL from proxy headers', () => {
        expect(
            resolveAppUrl(requestWith({ 'x-forwarded-proto': 'https', host: 'rocnest.app' }))
        ).toBe('https://rocnest.app')
    })

    it('uses only the first hop of a proxy chain', () => {
        expect(
            resolveAppUrl(
                requestWith({ 'x-forwarded-proto': 'https,http', 'x-forwarded-host': 'rocnest.app, internal' })
            )
        ).toBe('https://rocnest.app')
    })

    it('falls back to localhost when nothing is available', () => {
        expect(resolveAppUrl(requestWith({}))).toBe('http://localhost:3000')
    })
})
