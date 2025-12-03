'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button, Input, Textarea, Checkbox } from '@/components'
import { createCategory, updateCategory } from '../actions'
import { Category } from '../../domain/entities/Category'
import { Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DeleteCategoryDialog from './DeleteCategoryDialog'

interface CategoryDialogProps {
    category?: Category
    children?: React.ReactNode
    trigger?: React.ReactNode
}

export default function CategoryDialog({ category, children, trigger }: CategoryDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const isEditing = !!category

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            let result
            if (isEditing && category) {
                result = await updateCategory(category.id, formData)
            } else {
                result = await createCategory(formData)
            }

            if (result.success) {
                setOpen(false)
                router.refresh()
            } else {
                setError(result.error || 'Error desconocido')
            }
        } catch (err) {
            setError('Error al procesar la solicitud')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Categoría
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
                    <div className="space-y-4">
                        <Input
                            name="name"
                            label="Nombre"
                            defaultValue={category?.name}
                            required
                            placeholder="Ej: Cuerdas"
                        />

                        <Textarea
                            name="description"
                            label="Descripción"
                            defaultValue={category?.description || ''}
                            placeholder="Descripción de la categoría..."
                        />

                        <Input
                            name="icon"
                            label="Icono (Lucide name)"
                            defaultValue={category?.icon || ''}
                            placeholder="Ej: Rope"
                        />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
                        <p className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3">Opciones</p>
                        <Checkbox
                            name="requiresUniqueNumbering"
                            label="Requiere numeración única"
                            defaultChecked={category?.requiresUniqueNumbering}
                        />
                        <Checkbox
                            name="canBeComposite"
                            label="Puede ser compuesto (Kit)"
                            defaultChecked={category?.canBeComposite}
                        />
                        <Checkbox
                            name="canBeSubdivided"
                            label="Puede ser subdividido (Bobina)"
                            defaultChecked={category?.canBeSubdivided}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-[var(--color-destructive)] bg-[var(--color-destructive)]/10 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4">
                        {isEditing && category ? (
                            <DeleteCategoryDialog category={category}>
                                <Button type="button" variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
                                    Eliminar
                                </Button>
                            </DeleteCategoryDialog>
                        ) : <div />}

                        <div className="flex gap-3">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
