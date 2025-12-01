'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui'
import { Building2, Save } from 'lucide-react'

interface Organization {
    id: string
    name: string
    slug: string
    description: string | null
    logoUrl: string | null
    settings: any
}

interface OrganizationTabProps {
    organization: Organization
}

export default function OrganizationTab({ organization }: OrganizationTabProps) {
    const [formData, setFormData] = useState({
        name: organization.name,
        slug: organization.slug,
        description: organization.description || '',
        logoUrl: organization.logoUrl || '',
    })
    const [settings, setSettings] = useState(organization.settings || {
        allowMultipleCategories: true,
        requireItemApproval: false,
        maxItemsPerReservation: null
    })
    const [saving, setSaving] = useState(false)

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await fetch(`/api/organizations/${organization.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    settings
                })
            })

            if (res.ok) {
                alert('Organización actualizada correctamente')
                // Reload page to reflect changes
                window.location.reload()
            } else {
                const error = await res.json()
                alert(error.error || 'Error al actualizar organización')
            }
        } catch (error) {
            console.error('Error updating organization:', error)
            alert('Error al actualizar organización')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Información Básica
                    </CardTitle>
                    <CardDescription>
                        Detalles generales de la organización
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Nombre</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Slug (URL amigable)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                            required
                            pattern="[a-z0-9-]+"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Solo letras minúsculas, números y guiones
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">URL del Logo</label>
                        <input
                            type="url"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            placeholder="https://ejemplo.com/logo.png"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuración</CardTitle>
                    <CardDescription>
                        Ajustes de comportamiento de la organización
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Permitir múltiples categorías</div>
                            <div className="text-sm text-muted-foreground">
                                Los items pueden pertenecer a varias categorías
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.allowMultipleCategories}
                                onChange={(e) => setSettings({ ...settings, allowMultipleCategories: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Requiere aprobación de items</div>
                            <div className="text-sm text-muted-foreground">
                                Los nuevos items necesitan aprobación admin
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.requireItemApproval}
                                onChange={(e) => setSettings({ ...settings, requireItemApproval: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Máximo de items por reserva (0 = sin límite)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={settings.maxItemsPerReservation || 0}
                            onChange={(e) => setSettings({
                                ...settings,
                                maxItemsPerReservation: e.target.value === '0' ? null : parseInt(e.target.value)
                            })}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button type="submit" disabled={saving} size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>
        </form>
    )
}
