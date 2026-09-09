'use client'

// Presentation - Organism
// Renders the member collection and its loading / empty states.

import { Users } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState } from '@/components/ui'

import type { MemberDto } from '../../application/dtos/MemberDto'

import { MemberListItem } from './MemberListItem'

export interface MembersListProps {
    members: MemberDto[]
    currentUserId: string
    loading: boolean
    onChangeRole: (userId: string, role: string) => void
    onRemove: (member: MemberDto) => void
}

export function MembersList({ members, currentUserId, loading, onChangeRole, onRemove }: MembersListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Miembros de la organización</CardTitle>
                <CardDescription>
                    {members.length} {members.length === 1 ? 'miembro' : 'miembros'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-center py-8 text-[var(--color-muted-foreground)]">
                        Cargando miembros...
                    </p>
                ) : members.length === 0 ? (
                    <EmptyState
                        icon={<Users className="h-8 w-8" />}
                        title="No hay miembros"
                        description="Invita a alguien para empezar a trabajar en equipo"
                    />
                ) : (
                    <div className="space-y-3">
                        {members.map((member) => (
                            <MemberListItem
                                key={member.id}
                                member={member}
                                isCurrentUser={member.userId === currentUserId}
                                onChangeRole={onChangeRole}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
