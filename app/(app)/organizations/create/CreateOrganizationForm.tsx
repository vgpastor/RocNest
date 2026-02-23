'use client'

import { Building2, Loader2, AlertCircle, CheckCircle2, Sparkles, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { TemplateType } from '@/prisma/seeds/shared/templates'

import { TemplateSelector } from './TemplateSelector'

interface CreateOrganizationFormProps {
    userId: string
    isWelcome?: boolean
}

export function CreateOrganizationForm({ userId: _userId, isWelcome = false }: CreateOrganizationFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    })
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('climbing-club')

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
                .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Step 1: Create the organization
            const response = await fetch('/api/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    template: selectedTemplate,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la organización')
            }

            // Step 2: Refresh the JWT token to include the new organization
            const refreshResponse = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!refreshResponse.ok) {
                console.error('Error refreshing token, but organization was created')
                // Continue anyway - the user can manually refresh
            }

            // Step 3: Switch to the newly created organization
            const switchResponse = await fetch('/api/organizations/switch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ organizationId: data.organization.id }),
            })

            if (!switchResponse.ok) {
                throw new Error('Error al seleccionar la organización')
            }

            // Step 4: Hard reload to ensure organization context is loaded
            window.location.href = '/'
        } catch (err: unknown) {
            const error = err as Error
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Name */}
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
                    Nombre de la Organización
                    <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="Ej: Club de Montaña Los Picos"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                    required
                    disabled={loading}
                    maxLength={100}
                />
                <p className="text-xs text-[var(--color-muted-foreground)]">
                    El nombre completo de tu organización o club
                </p>
            </div>

            {/* Slug */}
            <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
                    Identificador Único (Slug)
                    <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <div className="relative">
                    <input
                        id="slug"
                        type="text"
                        placeholder="club-montana-picos"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-mono text-sm"
                        required
                        disabled={loading}
                        pattern="[a-z0-9-]+"
                        maxLength={50}
                    />
                    {formData.slug && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
                        </div>
                    )}
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                    Se genera automáticamente. Solo letras minúsculas, números y guiones.
                </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-semibold">
                    Descripción (Opcional)
                </label>
                <textarea
                    id="description"
                    placeholder="Describe brevemente tu organización..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none"
                    rows={4}
                    disabled={loading}
                    maxLength={500}
                />
                <p className="text-xs text-[var(--color-muted-foreground)] text-right">
                    {formData.description.length}/500
                </p>
            </div>

            {/* Template Selector */}
            <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--color-primary)]" />
                    Plantilla Inicial
                    <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <p className="text-xs text-[var(--color-muted-foreground)] mb-3">
                    Elige si quieres empezar con categorías y productos predefinidos o desde cero
                </p>
                <TemplateSelector
                    selected={selectedTemplate}
                    onChange={setSelectedTemplate}
                    disabled={loading}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--color-destructive-bg)] border border-[var(--color-destructive)]/20">
                    <AlertCircle className="h-5 w-5 text-[var(--color-destructive)] flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--color-destructive)]">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--color-info-bg)] border border-[var(--color-info)]/20">
                <Building2 className="h-5 w-5 text-[var(--color-info)] flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm text-[var(--color-info-foreground)]">
                    <p className="font-medium mb-1">Serás el administrador</p>
                    <p className="text-xs opacity-90">
                        Como creador, tendrás permisos completos para gestionar la organización,
                        invitar miembros y configurar el inventario.
                    </p>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
                {!isWelcome && (
                    <button
                        type="button"
                        onClick={() => router.push('/organizations/select')}
                        disabled={loading}
                        className="flex-1 py-3 px-4 border border-[var(--color-input)] hover:bg-[var(--color-accent)] rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading || !formData.name || !formData.slug}
                    className={`${isWelcome ? 'w-full' : 'flex-1'} py-3 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-primary-foreground)] font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creando...
                        </>
                    ) : (
                        <>
                            <Building2 className="h-5 w-5" />
                            {isWelcome ? 'Crear mi Organización y Comenzar' : 'Crear Organización'}
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
