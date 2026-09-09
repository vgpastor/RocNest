import { describe, it, expect } from 'vitest'

import { buildInvitationEmail } from '../email/templates/invitation'

const base = {
    to: 'jordi@example.org',
    organizationName: 'ICEM Pallars',
    inviterName: 'Victor',
    role: 'admin',
    invitationLink: 'https://rocnest.app/invitations/accept?token=abc',
    expiresAt: new Date('2026-09-16T10:00:00Z'),
}

describe('buildInvitationEmail', () => {
    it('includes the invitation link in both bodies', () => {
        const mail = buildInvitationEmail(base)
        expect(mail.text).toContain(base.invitationLink)
        expect(mail.html).toContain(base.invitationLink)
        expect(mail.subject).toContain('ICEM Pallars')
    })

    it('names the role in the invitation', () => {
        expect(buildInvitationEmail(base).text).toContain('administrador')
        expect(buildInvitationEmail({ ...base, role: 'member' }).text).toContain('miembro')
    })

    it('escapes organization and inviter names in the HTML body', () => {
        const mail = buildInvitationEmail({
            ...base,
            organizationName: '<script>alert(1)</script>',
            inviterName: 'Ana & "Co"',
        })

        expect(mail.html).not.toContain('<script>')
        expect(mail.html).toContain('&lt;script&gt;')
        expect(mail.html).toContain('Ana &amp; &quot;Co&quot;')
    })
})
