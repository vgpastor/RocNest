'use client'

// Presentation - Organism
// Invitation form. Owns only its own fields; the result is handed to the parent.

import { UserPlus } from 'lucide-react'
import { useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Select } from '@/components/ui'

import { ASSIGNABLE_ROLE_OPTIONS } from '../roleOptions'

export interface InviteMemberFormProps {
    onInvite: (email: string, role: string) => Promise<void>
    children?: React.ReactNode
}

export function InviteMemberForm({ onInvite, children }: InviteMemberFormProps) {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('member')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setSubmitting(true)

        try {
            await onInvite(email, role)
            setEmail('')
            setRole('member')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Invitar miembro
                </CardTitle>
                <CardDescription>
                    Le enviaremos un email con el enlace para unirse a la organización
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="usuario@ejemplo.com"
                                required
                            />
                        </div>
                        <Select
                            label="Rol"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            options={ASSIGNABLE_ROLE_OPTIONS}
                        />
                    </div>
                    <Button type="submit" isLoading={submitting} disabled={submitting}>
                        {submitting ? 'Enviando...' : 'Enviar invitación'}
                    </Button>
                </form>

                {children}
            </CardContent>
        </Card>
    )
}
