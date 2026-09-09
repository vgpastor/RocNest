// Presentation - Browser data access.
// The only module that knows the members endpoints, so components stay declarative.

import type { MemberDto } from '../application/dtos/MemberDto'

export interface InvitationResult {
    invitationLink: string
    emailSent: boolean
}

async function readError(response: Response, fallback: string): Promise<never> {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? fallback)
}

export class MembersClient {
    constructor(private readonly organizationId: string) {}

    private get base(): string {
        return `/api/organizations/${this.organizationId}/members`
    }

    async list(): Promise<MemberDto[]> {
        const response = await fetch(this.base)
        if (!response.ok) await readError(response, 'Error al obtener miembros')

        const data = await response.json()
        return data.members ?? []
    }

    async invite(email: string, role: string): Promise<InvitationResult> {
        const response = await fetch(this.base, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, role }),
        })
        if (!response.ok) await readError(response, 'Error al enviar la invitación')

        const data = await response.json()
        return { invitationLink: data.invitationLink, emailSent: Boolean(data.emailSent) }
    }

    async changeRole(userId: string, role: string): Promise<void> {
        const response = await fetch(`${this.base}/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }),
        })
        if (!response.ok) await readError(response, 'Error al cambiar el rol')
    }

    async remove(userId: string): Promise<void> {
        const response = await fetch(`${this.base}/${userId}`, { method: 'DELETE' })
        if (!response.ok) await readError(response, 'Error al remover el miembro')
    }
}
