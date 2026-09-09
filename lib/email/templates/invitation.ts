import type { EmailMessage } from '../EmailService'

export interface InvitationEmailInput {
    to: string
    organizationName: string
    inviterName: string
    role: string
    invitationLink: string
    expiresAt: Date
}

/** Organization and user names come from user input: escape before interpolating into HTML. */
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function roleLabel(role: string): string {
    return role === 'admin' ? 'administrador' : 'miembro'
}

export function buildInvitationEmail(input: InvitationEmailInput): EmailMessage {
    const { organizationName, inviterName, role, invitationLink, expiresAt } = input
    const expires = expiresAt.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    const subject = `${inviterName} te invita a ${organizationName} en RocNest`

    const text = [
        `Hola,`,
        ``,
        `${inviterName} te ha invitado a unirte a ${organizationName} en RocNest como ${roleLabel(role)}.`,
        ``,
        `Acepta la invitación aquí:`,
        invitationLink,
        ``,
        `El enlace caduca el ${expires}.`,
        ``,
        `Si no esperabas esta invitación, puedes ignorar este mensaje.`,
        ``,
        `RocNest — gestión de material deportivo`,
    ].join('\n')

    const html = `<!doctype html>
<html lang="es">
<body style="margin:0;padding:24px;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1917;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
    <tr><td>
      <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;">Invitación a ${escapeHtml(organizationName)}</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
        <strong>${escapeHtml(inviterName)}</strong> te ha invitado a unirte a
        <strong>${escapeHtml(organizationName)}</strong> en RocNest como ${roleLabel(role)}.
      </p>
      <p style="margin:0 0 24px;">
        <a href="${encodeURI(invitationLink)}" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;">Aceptar invitación</a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#57534e;">
        Si el botón no funciona, copia este enlace en tu navegador:
      </p>
      <p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all;color:#0d9488;">
        ${escapeHtml(invitationLink)}
      </p>
      <p style="margin:0 0 8px;font-size:13px;color:#57534e;">El enlace caduca el ${expires}.</p>
      <p style="margin:0;font-size:13px;color:#57534e;">
        Si no esperabas esta invitación, puedes ignorar este mensaje.
      </p>
    </td></tr>
  </table>
</body>
</html>`

    return { to: input.to, subject, html, text }
}
