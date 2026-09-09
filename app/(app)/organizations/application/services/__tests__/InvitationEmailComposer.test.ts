import { describe, it, expect } from 'vitest'

import type { Invitation } from '../../../domain/types'
import { OrganizationRole } from '../../../domain/value-objects/OrganizationRole'
import { InvitationEmailComposer } from '../InvitationEmailComposer'


const LINK = 'https://rocnest.app/invitations/accept?token=abc'

function invitation(overrides: Partial<Invitation> = {}): Invitation {
    return {
        id: 'invitation-1',
        token: 'abc',
        email: 'jordi@example.org',
        role: OrganizationRole.fromString('admin'),
        organization: { id: 'org-1', name: 'ICEM Pallars' },
        inviter: { id: 'user-1', email: 'victor@example.org', fullName: 'Victor' },
        expiresAt: new Date('2026-09-16T10:00:00Z'),
        acceptedAt: null,
        ...overrides,
    }
}

describe('InvitationEmailComposer', () => {
    const composer = new InvitationEmailComposer()

    it('puts the link in both bodies and names the organization in the subject', () => {
        const mail = composer.compose(invitation(), LINK)

        expect(mail.to).toBe('jordi@example.org')
        expect(mail.subject).toContain('ICEM Pallars')
        expect(mail.text).toContain(LINK)
        expect(mail.html).toContain(LINK)
    })

    it('names the role', () => {
        expect(composer.compose(invitation(), LINK).text).toContain('administrador')
        expect(
            composer.compose(invitation({ role: OrganizationRole.member() }), LINK).text
        ).toContain('miembro')
    })

    it('falls back to the inviter email when there is no name', () => {
        const mail = composer.compose(
            invitation({ inviter: { id: 'user-1', email: 'victor@example.org', fullName: null } }),
            LINK
        )

        expect(mail.subject).toContain('victor@example.org')
    })

    it('escapes names that come from user input', () => {
        const mail = composer.compose(
            invitation({
                organization: { id: 'org-1', name: '<script>alert(1)</script>' },
                inviter: { id: 'user-1', email: 'a@b.test', fullName: 'Ana & "Co"' },
            }),
            LINK
        )

        expect(mail.html).not.toContain('<script>')
        expect(mail.html).toContain('&lt;script&gt;')
        expect(mail.html).toContain('Ana &amp; &quot;Co&quot;')
    })
})
