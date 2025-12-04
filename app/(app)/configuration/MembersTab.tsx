'use client'

import { UserPlus, Trash2, User, CheckCircle, Copy } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui'

interface Member {
    id: string
    userId: string
    role: string
    joinedAt: string
    user: {
        id: string
        email: string
        fullName: string | null
    }
}

interface MembersTabProps {
    organizationId: string
    currentUserId: string
}

export default function MembersTab({ organizationId, currentUserId }: MembersTabProps) {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [inviting, setInviting] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState('member')
    const [invitationLink, setInvitationLink] = useState<string | null>(null)
    const [showInviteSuccess, setShowInviteSuccess] = useState(false)

    useEffect(() => {
        loadMembers()
    }, [organizationId])

    async function loadMembers() {
        try {
            const res = await fetch(`/api/organizations/${organizationId}/members`)
            if (res.ok) {
                const data = await res.json()
                setMembers(data.members || [])
            }
        } catch (error) {
            console.error('Error loading members:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleInvite(e: React.FormEvent) {
        e.preventDefault()
        setInviting(true)
        setShowInviteSuccess(false)

        try {
            const res = await fetch(`/api/organizations/${organizationId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            })

            if (res.ok) {
                const data = await res.json()
                setInvitationLink(data.invitationLink)
                setShowInviteSuccess(true)
                setInviteEmail('')
                setInviteRole('member')
            } else {
                const error = await res.json()
                alert(error.error || 'Error al enviar invitación')
            }
        } catch (error) {
            console.error('Error sending invitation:', error)
            alert('Error al enviar invitación')
        } finally {
            setInviting(false)
        }
    }

    async function handleChangeRole(userId: string, newRole: string) {
        if (!confirm(`¿Cambiar rol del usuario a "${newRole === 'admin' ? 'Admin' : 'Miembro'}"?`)) return

        try {
            const res = await fetch(`/api/organizations/${organizationId}/members/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            })

            if (res.ok) {
                await loadMembers()
            } else {
                const error = await res.json()
                alert(error.error || 'Error al cambiar rol')
            }
        } catch (error) {
            console.error('Error changing role:', error)
            alert('Error al cambiar rol')
        }
    }

    async function handleRemoveMember(userId: string) {
        if (!confirm('¿Estás seguro de remover a este miembro?')) return

        try {
            const res = await fetch(`/api/organizations/${organizationId}/members/${userId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                await loadMembers()
            } else {
                const error = await res.json()
                alert(error.error || 'Error al remover miembro')
            }
        } catch (error) {
            console.error('Error removing member:', error)
            alert('Error al remover miembro')
        }
    }

    function copyInvitationLink() {
        if (invitationLink) {
            navigator.clipboard.writeText(invitationLink)
            alert('Link de invitación copiado')
        }
    }

    return (
        <div className="space-y-6">
            {/* Invite Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Invitar Miembro
                    </CardTitle>
                    <CardDescription>
                        Envía una invitación para unirse a la organización
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium mb-2 block">Email</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="usuario@ejemplo.com"
                                    required
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Rol</label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-[var(--color-background)] text-[var(--color-foreground)]"
                                >
                                    <option value="member" className="bg-[var(--color-background)] text-[var(--color-foreground)]">Miembro</option>
                                    <option value="admin" className="bg-[var(--color-background)] text-[var(--color-foreground)]">Admin</option>
                                </select>
                            </div>
                        </div>
                        <Button type="submit" disabled={inviting}>
                            {inviting ? 'Enviando...' : 'Enviar Invitación'}
                        </Button>
                    </form>

                    {showInviteSuccess && invitationLink && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                <div className="flex-1">
                                    <div className="font-medium text-green-800 dark:text-green-200 mb-2">
                                        Invitación creada
                                    </div>
                                    <div className="text-sm text-green-700 dark:text-green-300 mb-2">
                                        Comparte este link con el usuario:
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={invitationLink}
                                            readOnly
                                            className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded font-mono"
                                        />
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={copyInvitationLink}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Members List */}
            <Card>
                <CardHeader>
                    <CardTitle>Miembros de la Organización</CardTitle>
                    <CardDescription>
                        {members.length} {members.length === 1 ? 'miembro' : 'miembros'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Cargando miembros...
                        </div>
                    ) : members.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No hay miembros en esta organización
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">
                                                {member.user.fullName || member.user.email}
                                                {member.userId === currentUserId && (
                                                    <span className="text-sm text-muted-foreground ml-2">(Tú)</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {member.user.email}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Unido {new Date(member.joinedAt).toLocaleDateString('es-ES')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleChangeRole(member.userId, e.target.value)}
                                            disabled={member.userId === currentUserId}
                                            className="px-3 py-1.5 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 bg-[var(--color-background)] text-[var(--color-foreground)]"
                                        >
                                            <option value="member" className="bg-[var(--color-background)] text-[var(--color-foreground)]">Miembro</option>
                                            <option value="admin" className="bg-[var(--color-background)] text-[var(--color-foreground)]">Admin</option>
                                        </select>
                                        {member.userId !== currentUserId && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleRemoveMember(member.userId)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
