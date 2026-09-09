'use client'

// Presentation - Molecule
// A single member row: identity, role and the remove action.

import { Trash2, User } from 'lucide-react'

import { Badge, Button, Select } from '@/components/ui'

import type { MemberDto } from '../../application/dtos/MemberDto'
import { ASSIGNABLE_ROLE_OPTIONS, isEditableRole, roleLabel } from '../roleOptions'

export interface MemberListItemProps {
    member: MemberDto
    isCurrentUser: boolean
    onChangeRole: (userId: string, role: string) => void
    onRemove: (member: MemberDto) => void
}

export function MemberListItem({ member, isCurrentUser, onChangeRole, onRemove }: MemberListItemProps) {
    const displayName = member.user.fullName || member.user.email

    return (
        <div className="flex items-center justify-between gap-4 p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-muted)]/50 transition-colors">
            <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <div className="min-w-0">
                    <p className="font-medium truncate">
                        {displayName}
                        {isCurrentUser && (
                            <span className="text-sm text-[var(--color-muted-foreground)] ml-2">(Tú)</span>
                        )}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)] truncate">{member.user.email}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                        Unido {new Date(member.joinedAt).toLocaleDateString('es-ES')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {isEditableRole(member.role) ? (
                    <Select
                        value={member.role}
                        onChange={(event) => onChangeRole(member.userId, event.target.value)}
                        disabled={isCurrentUser}
                        aria-label={`Rol de ${displayName}`}
                        options={ASSIGNABLE_ROLE_OPTIONS}
                    />
                ) : (
                    <Badge variant="secondary">{roleLabel(member.role)}</Badge>
                )}

                {!isCurrentUser && (
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRemove(member)}
                        aria-label={`Remover a ${displayName}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
