'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label, Textarea, Card, CardContent } from '@/components/ui'
import { Category } from '../domain/entities/Category'
import { ItemStatus, ItemStatusLabels } from '../domain/value-objects/ItemStatus'
import { DynamicMetadataFields } from '../presentation/components/DynamicMetadataFields'
import { Loader2 } from 'lucide-react'

interface NewItemFormProps {
    categories: Category[]
}

export default function NewItemForm({ categories }: NewItemFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        model: '',
        identifier: '',
        category_id: '',
        status: ItemStatus.AVAILABLE,
        metadata: {} as Record<string, any>
    })

    const handleCategoryChange = (categoryId: string) => {
        console.log('Category changed to:', categoryId)
        setFormData(prev => ({ ...prev, category_id: categoryId, metadata: {} }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Submitting form data:', formData)
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase
                .from('items')
                .insert([
                    {
                        name: formData.name,
                        brand: formData.brand,
                        model: formData.model,
                        identifier: formData.identifier,
                        category_id: formData.category_id,
                        status: formData.status,
                        metadata: formData.metadata,
                        is_composite: false
                    }
                ])
                .select()

            if (error) {
                console.error('Supabase error:', error)
                console.error('Error details:', JSON.stringify(error, null, 2))
                throw error
            }

            console.log('Item created successfully:', data)
            router.push('/catalogo')
            router.refresh()
        } catch (err: any) {
            console.error('Catch block error:', err)
            setError(err.message || JSON.stringify(err))
        } finally {
            setLoading(false)
        }
    }

    const selectedCategory = categories.find(c => c.id === formData.category_id)

    return (
        <Card>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="identifier">Identificador (Código)</Label>
                            <Input
                                id="identifier"
                                value={formData.identifier}
                                onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand">Marca</Label>
                            <Input
                                id="brand"
                                value={formData.brand}
                                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Modelo</Label>
                            <Input
                                id="model"
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <select
                            id="category"
                            required
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.category_id}
                            onChange={e => handleCategoryChange(e.target.value)}
                        >
                            <option value="">Seleccionar categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCategory && (
                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-4">Detalles Específicos</h3>
                            <DynamicMetadataFields
                                schema={selectedCategory.metadataSchema}
                                value={formData.metadata}
                                onChange={metadata => setFormData({ ...formData, metadata })}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Material
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
