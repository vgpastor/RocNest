'use client'

import { Plus, Trash2, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Alert } from '@/components/ui'

import { Item } from '../../domain/entities/Item'

interface SubdivideItemDialogProps {
    item: Item
    isOpen: boolean
    onClose: () => void
}

export function SubdivideItemDialog({ item, isOpen, onClose }: SubdivideItemDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [subdivisions, setSubdivisions] = useState<{ identifier: string; value: number }[]>([
        { identifier: `${item.identifier}-1`, value: 0 },
        { identifier: `${item.identifier}-2`, value: 0 }
    ])
    const [unit, _setUnit] = useState('m')
    const [reason, setReason] = useState('')

    const handleAddSubdivision = () => {
        setSubdivisions([
            ...subdivisions,
            { identifier: `${item.identifier}-${subdivisions.length + 1}`, value: 0 }
        ])
    }

    const handleRemoveSubdivision = (index: number) => {
        if (subdivisions.length <= 2) return
        const newSubs = [...subdivisions]
        newSubs.splice(index, 1)
        setSubdivisions(newSubs)
    }

    const handleUpdateSubdivision = (index: number, field: 'identifier' | 'value', value: string | number) => {
        const newSubs = [...subdivisions]
        newSubs[index] = { ...newSubs[index], [field]: value }
        setSubdivisions(newSubs)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (subdivisions.some(s => s.value <= 0)) {
            setError('Todos los tramos deben tener un valor mayor a 0')
            return
        }

        startTransition(async () => {
            try {
                const response = await fetch('/api/catalog/transformations/subdivide', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sourceItemId: item.id,
                        subdivisions,
                        unit,
                        reason
                    })
                })

                const result = await response.json()

                if (result.success) {
                    onClose()
                    window.location.reload()
                } else {
                    setError(result.error || 'Error al subdividir el item')
                }
            } catch (_error) {
                setError('Error de conexión')
            }
        })
    }

    const totalValue = subdivisions.reduce((sum, s) => sum + (s.value || 0), 0)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Subdividir Item</DialogTitle>
                    <DialogDescription>
                        Divide el item &ldquo;{item.name}&rdquo; en múltiples partes. El item original quedará marcado como subdividido.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <Alert variant="destructive">{error}</Alert>}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Item Original</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Identificador:</span>
                                <span className="ml-2 font-mono text-gray-900">{item.identifier}</span>
                            </div>
                            {item.metadata?.length && (
                                <div>
                                    <span className="text-gray-500">Longitud Original:</span>
                                    <span className="ml-2 font-medium text-gray-900">{item.metadata.length} {unit}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">Nuevos Tramos</h4>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddSubdivision}>
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Tramo
                            </Button>
                        </div>

                        {subdivisions.map((sub, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Identificador</label>
                                    <input
                                        type="text"
                                        value={sub.identifier}
                                        onChange={(e) => handleUpdateSubdivision(index, 'identifier', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Valor ({unit})</label>
                                    <input
                                        type="number"
                                        value={sub.value}
                                        onChange={(e) => handleUpdateSubdivision(index, 'value', parseFloat(e.target.value))}
                                        required
                                        min="0.1"
                                        step="0.1"
                                        className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                    />
                                </div>
                                {subdivisions.length > 2 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="mt-6 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                        onClick={() => handleRemoveSubdivision(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}

                        <div className="flex justify-end text-sm font-medium text-gray-700">
                            Total: {totalValue} {unit}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Subdivisión</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            rows={2}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                            placeholder="Ej: Corte para uso en rocódromo..."
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Subdividiendo...
                                </>
                            ) : (
                                'Confirmar Subdivisión'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
