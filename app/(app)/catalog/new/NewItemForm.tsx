'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button, Input, Label, Card, CardContent, Combobox } from '@/components/ui'

import { createItem } from '../actions'
import { Category } from '../domain/entities/Category'
import { DynamicMetadataFields } from '../presentation/components/DynamicMetadataFields'

interface NewItemFormProps {
    categories: Category[]
}

export default function NewItemForm({ categories }: NewItemFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        model: '',
        identifier: '',
        category_id: '',
        status: 'available',
        metadata: {} as Record<string, any>
    })
    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleCategoryChange = (categoryId: string) => {
        setFormData(prev => ({ ...prev, category_id: categoryId, metadata: {} }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const data = new FormData()
            data.append('name', formData.name)
            data.append('brand', formData.brand)
            data.append('model', formData.model)
            data.append('identifier', formData.identifier)
            data.append('category', formData.category_id)
            data.append('status', formData.status)
            data.append('metadata', JSON.stringify(formData.metadata))

            if (imageFile) {
                data.append('image', imageFile)
            }

            const result = await createItem(data)

            if (!result.success) {
                throw new Error(result.error || 'Error al crear item')
            }

            router.push('/catalog')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Error al crear item')
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
                        <Combobox
                            value={formData.category_id}
                            onChange={handleCategoryChange}
                            options={categories.map(cat => ({
                                value: cat.id,
                                label: cat.name
                            }))}
                            placeholder="Seleccionar categoría"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Imagen</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) setImageFile(file)
                            }}
                        />
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
