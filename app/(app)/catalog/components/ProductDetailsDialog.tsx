'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Button, Badge } from '@/components'
import { Package, Loader2, Trash2 } from 'lucide-react'
import { ItemStatusLabels } from '../domain/value-objects/ItemStatus'
import { getItemsForProduct } from '../actions'
import Link from 'next/link'

interface ProductDetailsDialogProps {
    product: any // Type this properly if possible, or use the Prisma type
    children: React.ReactNode
    isAdmin?: boolean
}

export default function ProductDetailsDialog({ product, children, isAdmin }: ProductDetailsDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open)
        if (open && !loaded) {
            setLoading(true)
            const result = await getItemsForProduct(product.id)
            if (result.success) {
                setItems(result.data || [])
                setLoaded(true)
            }
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle>{product.name}</DialogTitle>
                            <DialogDescription>
                                {product.brand} {product.model}
                            </DialogDescription>
                        </div>
                        {isAdmin && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-[var(--color-destructive)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10"
                                onClick={async () => {
                                    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                                        const { deleteProduct } = await import('../actions')
                                        const result = await deleteProduct(product.id)
                                        if (result.success) {
                                            setIsOpen(false)
                                            // Refresh page to update list
                                            window.location.reload()
                                        } else {
                                            alert('Error al eliminar el producto')
                                        }
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Product Info */}
                    <div className="flex gap-4">
                        <div className="w-32 h-20 bg-[var(--color-muted)] rounded-md overflow-hidden flex-shrink-0">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[var(--color-muted-foreground)]">
                                    <Package className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-[var(--color-muted-foreground)]">{product.description}</p>
                            <div className="mt-2 flex gap-2">
                                <Badge variant="secondary">
                                    Total: {product._count?.items || 0}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div>
                        <h3 className="text-sm font-medium mb-3">Inventario</h3>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-muted-foreground)]" />
                            </div>
                        ) : (
                            <div className="border rounded-md divide-y">
                                {items.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-[var(--color-muted-foreground)]">
                                        No hay items registrados para este producto.
                                    </div>
                                ) : (
                                    items.map((item) => {
                                        const statusInfo = ItemStatusLabels[item.status as keyof typeof ItemStatusLabels] || ItemStatusLabels.available
                                        return (
                                            <div key={item.id} className="p-3 flex items-center justify-between hover:bg-[var(--color-muted)]/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="font-mono text-sm font-medium">
                                                        {item.identifier || 'Sin ID'}
                                                    </div>
                                                    <Badge variant={statusInfo.variant} size="sm">
                                                        {statusInfo.label}
                                                    </Badge>
                                                </div>
                                                <Link href={`/catalog/${item.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                                                        Ver ficha
                                                    </Button>
                                                </Link>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
