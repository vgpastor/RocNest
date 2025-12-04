'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge,
    Input,
    Textarea
} from '@/components'
import { CheckCircle, XCircle, AlertCircle, Save, ArrowLeft } from 'lucide-react'

interface ChecklistItem {
    id: string
    label: string
    required: boolean
    type: 'boolean' | 'text' | 'number'
}

interface ReviewCheckItem {
    id: string
    checkItemId: string
    label: string
    checked: boolean
    value: string | null
    notes: string | null
}

interface ReviewFormProps {
    reviewId: string
    itemName: string
    itemIdentifier: string | null
    categoryName: string | null
    currentStatus: string
    currentPriority: string
    currentNotes: string | null
    checklistTemplate: ChecklistItem[]
    existingCheckItems: ReviewCheckItem[]
}

export default function ReviewForm({
    reviewId,
    itemName,
    itemIdentifier,
    categoryName,
    currentStatus,
    currentPriority,
    currentNotes,
    checklistTemplate,
    existingCheckItems,
}: ReviewFormProps) {
    const router = useRouter()
    const [status, setStatus] = useState(currentStatus)
    const [priority, setPriority] = useState(currentPriority)
    const [notes, setNotes] = useState(currentNotes || '')
    const [rejectionReason, setRejectionReason] = useState('')
    const [checkItems, setCheckItems] = useState<Map<string, { checked: boolean; value: string; notes: string }>>(
        new Map(
            checklistTemplate.map(item => {
                const existing = existingCheckItems.find(e => e.checkItemId === item.id)
                return [
                    item.id,
                    {
                        checked: existing?.checked || false,
                        value: existing?.value || '',
                        notes: existing?.notes || '',
                    },
                ]
            })
        )
    )
    const [saving, setSaving] = useState(false)

    const handleCheckItemChange = (itemId: string, field: 'checked' | 'value' | 'notes', value: boolean | string) => {
        setCheckItems(prev => {
            const newMap = new Map(prev)
            const current = newMap.get(itemId) || { checked: false, value: '', notes: '' }
            newMap.set(itemId, { ...current, [field]: value })
            return newMap
        })
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch(`/api/catalog/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    priority,
                    notes,
                    rejectionReason: status === 'rejected' ? rejectionReason : null,
                    checkItems: Array.from(checkItems.entries()).map(([checkItemId, data]) => ({
                        checkItemId,
                        ...data,
                    })),
                }),
            })

            if (!response.ok) {
                throw new Error('Error al guardar la revisión')
            }

            router.push('/catalog/reviews')
            router.refresh()
        } catch (error) {
            console.error('Error saving review:', error)
            alert('Error al guardar la revisión')
        } finally {
            setSaving(false)
        }
    }

    const completedChecks = Array.from(checkItems.values()).filter(item => item.checked).length
    const totalChecks = checklistTemplate.length
    const progress = totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{itemName}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        {itemIdentifier && (
                            <Badge variant="outline">#{itemIdentifier}</Badge>
                        )}
                        {categoryName && (
                            <span className="text-sm text-muted-foreground">
                                Categoría: {categoryName}
                            </span>
                        )}
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>

            {/* Progress */}
            {totalChecks > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Progreso del Checklist</span>
                                <span className="text-muted-foreground">
                                    {completedChecks} de {totalChecks} completados
                                </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-3">
                                <div
                                    className="bg-primary h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Review Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Estado de Revisión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Estado</label>
                            <select
                                className="w-full px-3 py-2 rounded-md border bg-background"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="pending">Pendiente</option>
                                <option value="in_progress">En Progreso</option>
                                <option value="approved">Aprobado</option>
                                <option value="rejected">Rechazado</option>
                                <option value="needs_attention">Requiere Atención</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Prioridad</label>
                            <select
                                className="w-full px-3 py-2 rounded-md border bg-background"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="low">Baja</option>
                                <option value="normal">Normal</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Notas Generales</label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Añade notas sobre esta revisión..."
                            rows={3}
                        />
                    </div>

                    {status === 'rejected' && (
                        <div>
                            <label className="text-sm font-medium mb-2 block text-red-500">
                                Razón de Rechazo *
                            </label>
                            <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explica por qué se rechaza este item..."
                                rows={3}
                                className="border-red-500"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Checklist */}
            {checklistTemplate.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Checklist de Verificación</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {checklistTemplate.map((item) => {
                            const checkData = checkItems.get(item.id) || { checked: false, value: '', notes: '' }

                            return (
                                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={checkData.checked}
                                            onChange={(e) => handleCheckItemChange(item.id, 'checked', e.target.checked)}
                                            className="mt-1 h-5 w-5 rounded border-gray-300"
                                        />
                                        <div className="flex-1">
                                            <label className="font-medium flex items-center gap-2">
                                                {item.label}
                                                {item.required && (
                                                    <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                                                        Requerido
                                                    </Badge>
                                                )}
                                            </label>

                                            {item.type === 'text' && (
                                                <Input
                                                    type="text"
                                                    value={checkData.value}
                                                    onChange={(e) => handleCheckItemChange(item.id, 'value', e.target.value)}
                                                    placeholder="Ingresa un valor..."
                                                    className="mt-2"
                                                />
                                            )}

                                            {item.type === 'number' && (
                                                <Input
                                                    type="number"
                                                    value={checkData.value}
                                                    onChange={(e) => handleCheckItemChange(item.id, 'value', e.target.value)}
                                                    placeholder="Ingresa un número..."
                                                    className="mt-2"
                                                />
                                            )}

                                            <Textarea
                                                value={checkData.notes}
                                                onChange={(e) => handleCheckItemChange(item.id, 'notes', e.target.value)}
                                                placeholder="Notas adicionales..."
                                                rows={2}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
