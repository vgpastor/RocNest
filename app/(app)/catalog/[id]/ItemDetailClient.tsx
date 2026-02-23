'use client'

import { ArrowLeft, Edit, Trash2, Split, HeartHandshake, AlertTriangle, Box } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// ItemStatus is a Value Object with getLabel() and getVariant() methods
import CreateReviewButton from '@/app/(app)/catalog/components/CreateReviewButton'
import { Category } from '@/app/(app)/catalog/domain/entities/Category'
import { Item } from '@/app/(app)/catalog/domain/entities/Item'
import { Transformation } from '@/app/(app)/catalog/domain/entities/Transformation'
import { DeteriorateItemDialog } from '@/app/(app)/catalog/presentation/components/DeteriorateItemDialog'
import { DonateItemDialog } from '@/app/(app)/catalog/presentation/components/DonateItemDialog'
import { SubdivideItemDialog } from '@/app/(app)/catalog/presentation/components/SubdivideItemDialog'
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface ItemDetailClientProps {
    item: Item
    category: Category | null
    transformations: Transformation[]
    isAdmin: boolean
}

export default function ItemDetailClient({ item, category, transformations, isAdmin }: ItemDetailClientProps) {
    const [isSubdivideOpen, setIsSubdivideOpen] = useState(false)
    const [isDeteriorateOpen, setIsDeteriorateOpen] = useState(false)
    const [isDonateOpen, setIsDonateOpen] = useState(false)

    // Use ItemStatus Value Object methods instead of legacy labels
    const statusLabel = item.status.getLabel()
    const statusVariant = item.status.getVariant()

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Dialogs */}
            <SubdivideItemDialog
                item={item}
                isOpen={isSubdivideOpen}
                onClose={() => setIsSubdivideOpen(false)}
            />
            <DeteriorateItemDialog
                item={item}
                isOpen={isDeteriorateOpen}
                onClose={() => setIsDeteriorateOpen(false)}
            />
            <DonateItemDialog
                item={item}
                isOpen={isDonateOpen}
                onClose={() => setIsDonateOpen(false)}
            />

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/catalog">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
                        <Badge variant={statusVariant} className="text-sm px-3 py-1">
                            {statusLabel}
                        </Badge>
                    </div>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm text-gray-700">
                            {item.identifier}
                        </span>
                        <span>•</span>
                        <span>{category?.name}</span>
                    </p>
                </div>
                {isAdmin && (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                                if (confirm('¿Estás seguro de que quieres eliminar este item?')) {
                                    const { deleteItem } = await import('../actions')
                                    const result = await deleteItem(item.id)
                                    if (result.success) {
                                        window.location.href = '/catalog'
                                    } else {
                                        alert('Error al eliminar el item')
                                    }
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Image & Description */}
                    <Card>
                        <div className="aspect-video w-full bg-gray-100 relative overflow-hidden rounded-t-xl border-b border-gray-100">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Box className="h-16 w-16" />
                                </div>
                            )}
                        </div>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {item.description || "Sin descripción disponible."}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Marca</p>
                                    <p className="text-gray-900 font-medium">{item.brand}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Modelo</p>
                                    <p className="text-gray-900 font-medium">{item.model}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    {item.metadata && Object.keys(item.metadata).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Especificaciones Técnicas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {Object.entries(item.metadata).map(([key, value]) => (
                                        <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 truncate" title={key}>
                                                {key.replace(/_/g, ' ')}
                                            </p>
                                            <p className="text-gray-900 font-medium truncate" title={String(value)}>
                                                {String(value)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Transformaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transformations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <Box className="h-10 w-10 text-gray-300 mb-2" />
                                    <p className="text-gray-500 text-sm font-medium">
                                        Sin transformaciones registradas
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Este item no ha sufrido cambios de estado.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {transformations.map((t) => (
                                        <div key={t.id} className="relative pl-6 border-l-2 border-gray-200 last:border-0 pb-6 last:pb-0">
                                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-sky-100 border-2 border-sky-500" />
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900 capitalize">
                                                        {t.type === 'subdivision' && 'Subdivisión'}
                                                        {t.type === 'deterioration' && 'Deterioro Registrado'}
                                                        {t.type === 'donation' && 'Donación'}
                                                        {t.type === 'loss' && 'Pérdida'}
                                                        {t.type === 'recovery' && 'Recuperación'}
                                                        {t.type === 'assembly' && 'Ensamblaje'}
                                                        {t.type === 'disassembly' && 'Desensamblaje'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">{t.reason}</p>
                                                    {t.notes && (
                                                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                                            &ldquo;{t.notes}&rdquo;
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {t.performedAt.toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    {isAdmin && (
                        <Card className="border-sky-100 bg-sky-50/50">
                            <CardHeader>
                                <CardTitle className="text-sky-900">Acciones de Ciclo de Vida</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {category?.canBeSubdivided && (
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                        onClick={() => setIsSubdivideOpen(true)}
                                    >
                                        <Split className="h-4 w-4 mr-2 text-sky-600" />
                                        Subdividir Item
                                    </Button>
                                )}

                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => setIsDeteriorateOpen(true)}
                                >
                                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                                    Registrar Deterioro
                                </Button>

                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => setIsDonateOpen(true)}
                                >
                                    <HeartHandshake className="h-4 w-4 mr-2 text-emerald-600" />
                                    Donar Item
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {isAdmin && (
                        <Card className="border-orange-100 bg-orange-50/50">
                            <CardHeader>
                                <CardTitle className="text-orange-900">Revisión de Material</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CreateReviewButton
                                    itemId={item.id}
                                    itemName={item.name}
                                    size="sm"
                                    variant="outline"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Crear una revisión para verificar el estado del material
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Components (if composite) */}
                    {item.isComposite && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Componentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    Este es un item compuesto. (Lista de componentes pendiente de implementación)
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
