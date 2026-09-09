// Application Layer - Service
// Pure transformation from an invitation into an email message. No I/O, so it is
// trivially testable and the delivery mechanism stays interchangeable.

import type { EmailMessage } from '../../domain/services/IEmailSender'
import type { Invitation } from '../../domain/types'

/** Organization and user names come from user input: escape before interpolating into HTML. */
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export class InvitationEmailComposer {
    compose(invitation: Invitation, invitationLink: string): EmailMessage {
        const organizationName = invitation.organization.name
        const inviterName = invitation.inviter.fullName || invitation.inviter.email
        const roleLabel = invitation.role.label
        const expires = invitation.expiresAt.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })

        return {
            to: invitation.email,
            subject: `${inviterName} te invita a ${organizationName} en RocNest`,
            text: this.text({ organizationName, inviterName, roleLabel, invitationLink, expires }),
            html: this.html({ organizationName, inviterName, roleLabel, invitationLink, expires }),
        }
    }

    private text(v: TemplateValues): string {
        return [
            'Hola,',
            '',
            `${v.inviterName} te ha invitado a unirte a ${v.organizationName} en RocNest como ${v.roleLabel}.`,
            '',
            'Acepta la invitación aquí:',
            v.invitationLink,
            '',
            `El enlace caduca el ${v.expires}.`,
            '',
            'Si no esperabas esta invitación, puedes ignorar este mensaje.',
            '',
            'RocNest — gestión de material deportivo',
        ].join('\n')
    }

    private html(v: TemplateValues): string {
        return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:24px;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1917;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
    <tr><td>
      <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;">Invitación a ${escapeHtml(v.organizationName)}</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
        <strong>${escapeHtml(v.inviterName)}</strong> te ha invitado a unirte a
        <strong>${escapeHtml(v.organizationName)}</strong> en RocNest como ${v.roleLabel}.
      </p>
      <p style="margin:0 0 24px;">
        <a href="${encodeURI(v.invitationLink)}" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;">Aceptar invitación</a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#57534e;">
        Si el botón no funciona, copia este enlace en tu navegador:
      </p>
      <p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all;color:#0d9488;">
        ${escapeHtml(v.invitationLink)}
      </p>
      <p style="margin:0 0 8px;font-size:13px;color:#57534e;">El enlace caduca el ${v.expires}.</p>
      <p style="margin:0;font-size:13px;color:#57534e;">
        Si no esperabas esta invitación, puedes ignorar este mensaje.
      </p>
    </td></tr>
  </table>
</body>
</html>`
    }
}

interface TemplateValues {
    organizationName: string
    inviterName: string
    roleLabel: string
    invitationLink: string
    expires: string
}
