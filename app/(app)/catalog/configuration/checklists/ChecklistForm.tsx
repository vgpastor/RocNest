'use client'

import { Plus, Trash2, Save, ArrowLeft, GripVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Textarea,
} from '@/components'


interface ChecklistItem {
    id: string
    label: string
    required: boolean
    type: 'boolean' | 'text' | 'number'
}

interface ChecklistFormProps {
    templateId?: string
    categoryId: string
    categoryName: string
    initialData?: {
        name: string
        description: string | null
        items: ChecklistItem[]
        isActive: boolean
    }
}

export default function ChecklistForm({
    templateId,
    categoryId,
    categoryName,
    initialData,
}: ChecklistFormProps) {
    const router = useRouter()
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
    const [items, setItems] = useState<ChecklistItem[]>(
        initialData?.items || [
            {
                id: crypto.randomUUID(),
                label: '',
                required: false,
                type: 'boolean',
            },
        ]
    )
    const [saving, setSaving] = useState(false)

    const addItem = () => {
        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                label: '',
                required: false,
                type: 'boolean',
            },
        ])
    }

    const removeItem = (id: string) => {
        if (items.length === 1) {
            alert('Debe haber al menos un item en el checklist')
            return
        }
        setItems(items.filter((item) => item.id !== id))
    }

    const updateItem = (id: string, field: keyof ChecklistItem, value: any) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        )
    }

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items]
        const targetIndex = direction === 'up' ? index - 1 : index + 1

        if (targetIndex < 0 || targetIndex >= items.length) {
            return
        }

        ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
        setItems(newItems)
    }

    const handleSave = async () => {
        // Validation
        if (!name.trim()) {
            alert('El nombre de la plantilla es requerido')
            return
        }

        const emptyItems = items.filter((item) => !item.label.trim())
        if (emptyItems.length > 0) {
            alert('Todos los items deben tener una etiqueta')
            return
        }

        setSaving(true)
        try {
            const url = templateId
                ? `/api/catalog/checklist-templates/${templateId}`
                : '/api/catalog/checklist-templates'

            const response = await fetch(url, {
                method: templateId ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoryId,
                    name,
                    description: description.trim() || null,
                    items,
                    isActive,
                }),
            })

            if (!response.ok) {
                throw new Error('Error al guardar la plantilla')
            }

            router.push('/catalog/configuration/checklists')
            router.refresh()
        } catch (error) {
            console.error('Error saving template:', error)
            alert('Error al guardar la plantilla')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">
                        {templateId ? 'Editar' : 'Nueva'} Plantilla de Checklist
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Categoría: {categoryName}
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Nombre de la Plantilla *
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Checklist de Revisión de Cuerdas"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Descripción
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe el propósito de esta plantilla..."
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium">
                            Plantilla activa
                        </label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Items del Checklist</CardTitle>
                        <Button size="sm" onClick={addItem}>
                            <Plus className="h-4 w-4 mr-2" />
                            Añadir Item
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4 space-y-3 bg-card"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col gap-1 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => moveItem(index, 'up')}
                                        disabled={index === 0}
                                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                                    >
                                        ↑
                                    </button>
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    <button
                                        type="button"
                                        onClick={() => moveItem(index, 'down')}
                                        disabled={index === items.length - 1}
                                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                                    >
                                        ↓
                                    </button>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Etiqueta *
                                        </label>
                                        <Input
                                            value={item.label}
                                            onChange={(e) =>
                                                updateItem(item.id, 'label', e.target.value)
                                            }
                                            placeholder="Ej: Verificar estado de las costuras"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Tipo de Verificación
                                            </label>
                                            <select
                                                value={item.type}
                                                onChange={(e) =>
                                                    updateItem(item.id, 'type', e.target.value)
                                                }
                                                className="w-full px-3 py-2 rounded-md border bg-background"
                                            >
                                                <option value="boolean">Sí/No (Checkbox)</option>
                                                <option value="text">Texto</option>
                                                <option value="number">Número</option>
                                            </select>
                                        </div>

                                        <div className="flex items-end">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={item.required}
                                                    onChange={(e) =>
                                                        updateItem(item.id, 'required', e.target.checked)
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                                <span className="text-sm font-medium">Requerido</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 hover:text-red-600 mt-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No hay items en el checklist. Añade al menos uno.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
