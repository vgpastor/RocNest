'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Alert } from '@/components/ui'

import { Item } from '../../domain/entities/Item'

interface DeteriorateItemDialogProps {
    item: Item
    isOpen: boolean
    onClose: () => void
}

export function DeteriorateItemDialog({ item, isOpen, onClose }: DeteriorateItemDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const [damagedValue, setDamagedValue] = useState<number>(0)
    const [damageReason, setDamageReason] = useState('')
    const [damageLocation, setDamageLocation] = useState('')
    const [unit, setUnit] = useState('m') // Should be dynamic

    // Try to get original value from metadata
    const originalValue = item.metadata?.length || item.metadata?.weight || 0

    const remainingValue = Math.max(0, originalValue - damagedValue)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (damagedValue <= 0 || damagedValue > originalValue) {
            setError('El valor dañado debe ser mayor a 0 y menor o igual al valor original')
            return
        }

        startTransition(async () => {
            try {
                const response = await fetch('/api/catalog/transformations/deteriorate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        itemId: item.id,
                        originalValue,
                        damagedValue,
                        remainingValue,
                        damageLocation,
                        damageReason,
                        unit
                    })
                })

                const result = await response.json()

                if (result.success) {
                    onClose()
                    window.location.reload()
                } else {
                    setError(result.error || 'Error al registrar deterioro')
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
                    <DialogTitle>Registrar Deterioro</DialogTitle>
                    <DialogDescription>
                        Registra un daño en el item "{item.name}". Si el daño es parcial, se creará un nuevo item de descarte con la parte dañada.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <Alert variant="destructive">{error}</Alert>}

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p className="font-medium">Atención</p>
                                <p>Esta acción reducirá el valor del item original y creará un registro de descarte.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor Original ({unit})</label>
                            <input
                                type="number"
                                value={originalValue}
                                disabled
                                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Dañada ({unit})</label>
                            <input
                                type="number"
                                value={damagedValue}
                                onChange={(e) => setDamagedValue(parseFloat(e.target.value))}
                                required
                                min="0.1"
                                max={originalValue}
                                step="0.1"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor Restante ({unit})</label>
                            <input
                                type="number"
                                value={remainingValue}
                                disabled
                                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm font-medium text-sky-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación del Daño</label>
                            <input
                                type="text"
                                value={damageLocation}
                                onChange={(e) => setDamageLocation(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                placeholder="Ej: A 3 metros del extremo..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo / Tipo de Daño</label>
                            <textarea
                                value={damageReason}
                                onChange={(e) => setDamageReason(e.target.value)}
                                required
                                rows={2}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                placeholder="Ej: Corte por arista, desgaste de camisa..."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="destructive" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                'Confirmar Deterioro'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
