'use client'

import { Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Alert } from '@/components/ui'

import { Item } from '../../domain/entities/Item'

interface DonateItemDialogProps {
    item: Item
    isOpen: boolean
    onClose: () => void
}

export function DonateItemDialog({ item, isOpen, onClose }: DonateItemDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const [location, setLocation] = useState('')
    const [recipients, setRecipients] = useState('')
    const [reason, setReason] = useState('')
    const [recoverable, setRecoverable] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        startTransition(async () => {
            try {
                const response = await fetch('/api/catalog/transformations/donate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        itemIds: [item.id],
                        location,
                        recipients: recipients.split(',').map(r => r.trim()).filter(Boolean),
                        reason,
                        recoverable
                    })
                })

                const result = await response.json()

                if (result.success) {
                    onClose()
                    window.location.reload()
                } else {
                    setError(result.error || 'Error al registrar donación')
                }
            } catch (error) {
                setError('Error de conexión')
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Donar Item</DialogTitle>
                    <DialogDescription>
                        Registra la donación del item &ldquo;{item.name}&rdquo;. El item dejará de estar disponible en el inventario activo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <Alert variant="destructive">{error}</Alert>}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Destino / Ubicación</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                placeholder="Ej: Club Alpino, Escuela de Escalada..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiarios (opcional)</label>
                            <input
                                type="text"
                                value={recipients}
                                onChange={(e) => setRecipients(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                placeholder="Nombres separados por comas"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Donación</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                rows={2}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                placeholder="Ej: Retirado por antigüedad pero apto para decoración..."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="recoverable"
                                checked={recoverable}
                                onChange={(e) => setRecoverable(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                            />
                            <label htmlFor="recoverable" className="text-sm text-gray-700">
                                Es recuperable (préstamo a largo plazo)
                            </label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                'Confirmar Donación'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
