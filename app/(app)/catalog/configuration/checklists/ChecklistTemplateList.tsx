'use client'

import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Badge, Button } from '@/components'

interface ChecklistTemplateItem {
    id: string
    label: string
    required: boolean
    type: 'boolean' | 'text' | 'number'
}

interface ChecklistTemplate {
    id: string
    name: string
    description: string | null
    items: ChecklistTemplateItem[] | unknown
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface ChecklistTemplateListProps {
    templates: ChecklistTemplate[]
}

export default function ChecklistTemplateList({ templates }: ChecklistTemplateListProps) {
    const [localTemplates, setLocalTemplates] = useState(templates)

    const toggleActive = async (templateId: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/catalog/checklist-templates/${templateId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isActive: !currentStatus,
                }),
            })

            if (!response.ok) {
                throw new Error('Error al actualizar la plantilla')
            }

            setLocalTemplates(prev =>
                prev.map(t => (t.id === templateId ? { ...t, isActive: !currentStatus } : t))
            )
        } catch (error) {
            console.error('Error toggling template:', error)
            alert('Error al actualizar la plantilla')
        }
    }

    const deleteTemplate = async (templateId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
            return
        }

        try {
            const response = await fetch(`/api/catalog/checklist-templates/${templateId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Error al eliminar la plantilla')
            }

            setLocalTemplates(prev => prev.filter(t => t.id !== templateId))
        } catch (error) {
            console.error('Error deleting template:', error)
            alert('Error al eliminar la plantilla')
        }
    }

    return (
        <div className="space-y-3">
            {localTemplates.map((template) => {
                const items = Array.isArray(template.items) ? template.items : []
                const requiredCount = items.filter((item: ChecklistTemplateItem) => item.required).length

                return (
                    <div
                        key={template.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{template.name}</h4>
                                    <Badge
                                        variant={template.isActive ? 'success' : 'secondary'}
                                    >
                                        {template.isActive ? 'Activa' : 'Inactiva'}
                                    </Badge>
                                </div>

                                {template.description && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {template.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{items.length} items</span>
                                    {requiredCount > 0 && (
                                        <span>{requiredCount} requeridos</span>
                                    )}
                                    <span>
                                        Actualizada: {new Date(template.updatedAt).toLocaleDateString('es-ES')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleActive(template.id, template.isActive)}
                                    title={template.isActive ? 'Desactivar' : 'Activar'}
                                >
                                    {template.isActive ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>

                                <Link href={`/catalog/configuration/checklists/${template.id}/edit`}>
                                    <Button size="sm" variant="outline">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deleteTemplate(template.id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
