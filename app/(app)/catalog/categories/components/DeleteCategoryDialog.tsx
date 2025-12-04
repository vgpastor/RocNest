'use client'

import { Loader2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'

import { Category } from '../../domain/entities/Category'
import { deleteCategory, getCategoryProducts } from '../actions'

interface DeleteCategoryDialogProps {
    category: Category
    children: React.ReactNode
}

export default function DeleteCategoryDialog({ category, children }: DeleteCategoryDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(false)
    const [products, setProducts] = useState<{ id: string, name: string }[]>([])
    const [step, setStep] = useState<'confirm' | 'warning'>('confirm')
    const router = useRouter()

    const handleOpenChange = async (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen) {
            setChecking(true)
            setStep('confirm')
            try {
                const associatedProducts = await getCategoryProducts(category.id)
                setProducts(associatedProducts)
                if (associatedProducts.length > 0) {
                    setStep('warning')
                }
            } catch (error) {
                console.error('Error checking products:', error)
            } finally {
                setChecking(false)
            }
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteCategory(category.id)
            if (result.success) {
                setOpen(false)
                router.refresh()
            } else {
                // Handle error (maybe show a toast or error state)
                console.error(result.error)
            }
        } catch (error) {
            console.error('Error deleting category:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {step === 'warning' && <AlertTriangle className="h-5 w-5 text-[var(--color-warning)]" />}
                        {step === 'warning' ? '¡Atención! Categoría en uso' : '¿Eliminar categoría?'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'warning'
                            ? `Esta categoría contiene ${products.length} productos. Si la eliminas, estos productos se desvincularán pero NO se borrarán de la base de datos.`
                            : `¿Estás seguro de que quieres eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`
                        }
                    </DialogDescription>
                </DialogHeader>

                {checking ? (
                    <div className="py-8 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-muted-foreground)]" />
                    </div>
                ) : (
                    <>
                        {step === 'warning' && (
                            <div className="max-h-[200px] overflow-y-auto border rounded-md p-3 bg-[var(--color-muted)]/30">
                                <p className="text-sm font-medium mb-2 text-[var(--color-foreground)]">Productos afectados:</p>
                                <ul className="space-y-1">
                                    {products.map(p => (
                                        <li key={p.id} className="text-sm text-[var(--color-muted-foreground)] flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted-foreground)]" />
                                            {p.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={loading}
                                className="bg-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/90"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {step === 'warning' ? 'Entendido, eliminar categoría' : 'Eliminar'}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
