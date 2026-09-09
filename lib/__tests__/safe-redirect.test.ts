import { describe, it, expect } from 'vitest'

import { safeRedirectPath } from '../safe-redirect'

describe('safeRedirectPath', () => {
    it('keeps same-origin paths', () => {
        expect(safeRedirectPath('/invitations/accept?token=abc', '/')).toBe('/invitations/accept?token=abc')
    })

    it('falls back when there is no target', () => {
        expect(safeRedirectPath(null, '/')).toBe('/')
        expect(safeRedirectPath('', '/')).toBe('/')
    })

    it('rejects off-site targets', () => {
        expect(safeRedirectPath('https://evil.com', '/')).toBe('/')
        expect(safeRedirectPath('//evil.com', '/')).toBe('/')
        expect(safeRedirectPath('/\\evil.com', '/')).toBe('/')
    })
})
