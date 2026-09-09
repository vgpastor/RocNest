'use client'

// Presentation - Template
// Container for the members screen: owns the state and orchestrates the
// invitation form, the list and the confirmation dialogs.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/ui'

import type { MemberDto } from '../../application/dtos/MemberDto'
import { MembersClient, type InvitationResult } from '../membersClient'
import { roleLabel } from '../roleOptions'

import { InvitationLinkPanel } from './InvitationLinkPanel'
import { InviteMemberForm } from './InviteMemberForm'
import { MembersList } from './MembersList'

export interface MembersManagerProps {
    organizationId: string
    currentUserId: string
}

interface PendingRoleChange {
    userId: string
    role: string
    displayName: string
}

interface LastInvitation extends InvitationResult {
    email: string
}

export function MembersManager({ organizationId, currentUserId }: MembersManagerProps) {
    const client = useMemo(() => new MembersClient(organizationId), [organizationId])

    const [members, setMembers] = useState<MemberDto[]>([])
    const [loading, setLoading] = useState(true)
    const [lastInvitation, setLastInvitation] = useState<LastInvitation | null>(null)
    const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange | null>(null)
    const [memberToRemove, setMemberToRemove] = useState<MemberDto | null>(null)

    const loadMembers = useCallback(async () => {
        try {
            setMembers(await client.list())
        } catch (error) {
            toast.error(errorMessage(error, 'Error al obtener miembros'))
        } finally {
            setLoading(false)
        }
    }, [client])

    useEffect(() => {
        loadMembers()
    }, [loadMembers])

    async function handleInvite(email: string, role: string) {
        try {
            const result = await client.invite(email, role)
            setLastInvitation({ ...result, email })
            toast.success(
                result.emailSent ? `Invitación enviada a ${email}` : 'Invitación creada'
            )
        } catch (error) {
            toast.error(errorMessage(error, 'Error al enviar la invitación'))
        }
    }

    function requestRoleChange(userId: string, role: string) {
        const member = members.find((candidate) => candidate.userId === userId)
        if (!member || member.role === role) return

        setPendingRoleChange({
            userId,
            role,
            displayName: member.user.fullName || member.user.email,
        })
    }

    async function confirmRoleChange() {
        if (!pendingRoleChange) return

        try {
            await client.changeRole(pendingRoleChange.userId, pendingRoleChange.role)
            toast.success(`Rol actualizado a ${roleLabel(pendingRoleChange.role)}`)
            await loadMembers()
        } catch (error) {
            toast.error(errorMessage(error, 'Error al cambiar el rol'))
        } finally {
            setPendingRoleChange(null)
        }
    }

    async function confirmRemoval() {
        if (!memberToRemove) return

        try {
            await client.remove(memberToRemove.userId)
            toast.success('Miembro removido de la organización')
            await loadMembers()
        } catch (error) {
            toast.error(errorMessage(error, 'Error al remover el miembro'))
        } finally {
            setMemberToRemove(null)
        }
    }

    return (
        <div className="space-y-6">
            <InviteMemberForm onInvite={handleInvite}>
                {lastInvitation && (
                    <InvitationLinkPanel
                        invitationLink={lastInvitation.invitationLink}
                        email={lastInvitation.email}
                        emailSent={lastInvitation.emailSent}
                    />
                )}
            </InviteMemberForm>

            <MembersList
                members={members}
                currentUserId={currentUserId}
                loading={loading}
                onChangeRole={requestRoleChange}
                onRemove={setMemberToRemove}
            />

            <ConfirmDialog
                open={pendingRoleChange !== null}
                title="Cambiar rol"
                description={
                    pendingRoleChange
                        ? `¿Cambiar el rol de ${pendingRoleChange.displayName} a "${roleLabel(pendingRoleChange.role)}"?`
                        : ''
                }
                confirmLabel="Cambiar rol"
                onConfirm={confirmRoleChange}
                onOpenChange={(open) => !open && setPendingRoleChange(null)}
            />

            <ConfirmDialog
                open={memberToRemove !== null}
                title="Remover miembro"
                description={
                    memberToRemove
                        ? `¿Seguro que quieres remover a ${memberToRemove.user.fullName || memberToRemove.user.email} de la organización?`
                        : ''
                }
                confirmLabel="Remover"
                variant="destructive"
                onConfirm={confirmRemoval}
                onOpenChange={(open) => !open && setMemberToRemove(null)}
            />
        </div>
    )
}

function errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback
}
