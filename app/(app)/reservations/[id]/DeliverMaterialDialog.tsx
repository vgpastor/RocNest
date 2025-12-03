// Deliver Material Dialog - Admin Only
'use client';

import { useState } from 'react';
import { Button, Combobox } from '@/components/ui';
import { X, Package, Plus, Trash2 } from 'lucide-react';

interface Props {
    reservation: any;
    organizationItems: any[];
    allCategories: any[];
    organizationId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeliverMaterialDialog({
    reservation,
    organizationItems,
    allCategories,
    organizationId,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Map requested items to selections (only those not yet delivered)
    const [itemAssignments, setItemAssignments] = useState(
        reservation.reservationItems
            .filter((ri: any) => !ri.actualItemId)
            .map((ri: any) => ({
                reservationItemId: ri.id,
                categoryId: ri.categoryId,
                categoryName: ri.category.name,
                requestedQuantity: ri.requestedQuantity,
                productId: '',
                actualItemId: '',
            }))
    );

    // Additional items not originally requested
    const [additionalItems, setAdditionalItems] = useState<Array<{
        categoryId: string;
        productId: string;
        actualItemId: string;
    }>>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Filter out unassigned items (allow partial delivery)
            const assignedItems = itemAssignments.filter((ia: any) => ia.actualItemId);

            const response = await fetch(
                `/api/organizations/${organizationId}/reservations/${reservation.id}/deliver`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: assignedItems.map((ia: any) => ({
                            reservationItemId: ia.reservationItemId,
                            actualItemId: ia.actualItemId,
                        })),
                        additionalItems: additionalItems.filter(ai => ai.actualItemId).map(ai => ({
                            categoryId: ai.categoryId,
                            actualItemId: ai.actualItemId,
                        })),
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al entregar material');
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const getProductsForCategory = (categoryId: string) => {
        const items = organizationItems.filter(item => item.categoryId === categoryId);
        // Deduplicate products
        const uniqueProducts = new Map();
        items.forEach(item => {
            if (!uniqueProducts.has(item.product.id)) {
                uniqueProducts.set(item.product.id, item.product);
            }
        });
        return Array.from(uniqueProducts.values());
    };

    const getItemsForProduct = (productId: string) => {
        return organizationItems.filter(item => item.product.id === productId);
    };

    const handleProductChange = (
        type: 'requested' | 'additional',
        index: number,
        productId: string
    ) => {
        const items = getItemsForProduct(productId);
        // Check if items are serialized (have identifier)
        const isSerialized = items.some(item => item.identifier);

        let actualItemId = '';
        if (!isSerialized) {
            // Auto-select first available item if not serialized
            const availableItem = items.find(item => item.status === 'available');
            if (availableItem) {
                actualItemId = availableItem.id;
            }
        }

        if (type === 'requested') {
            const newAssignments = [...itemAssignments];
            newAssignments[index].productId = productId;
            newAssignments[index].actualItemId = actualItemId;
            setItemAssignments(newAssignments);
        } else {
            const newItems = [...additionalItems];
            newItems[index].productId = productId;
            newItems[index].actualItemId = actualItemId;
            setAdditionalItems(newItems);
        }
    };

    // allCategories is now passed as prop

    const getCategoryName = (categoryId: string) => {
        const category = allCategories.find(c => c.id === categoryId);
        return category?.name || 'Categoría desconocida';
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-xl">
                <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold">Entregar Material</h2>
                        <p className="text-muted-foreground">Asigna items específicos a esta reserva</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Requested Items */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Material Solicitado
                        </h3>

                        {itemAssignments.map((assignment: any, idx: number) => {
                            const productsForCategory = getProductsForCategory(assignment.categoryId);
                            const itemsForProduct = assignment.productId ? getItemsForProduct(assignment.productId) : [];
                            const isSerialized = itemsForProduct.some(item => item.identifier);

                            return (
                                <div key={idx} className="p-4 border border-border rounded-lg bg-card text-card-foreground">
                                    <div className="mb-3">
                                        <div className="font-medium">{assignment.categoryName}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Cantidad solicitada: {assignment.requestedQuantity}
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        {/* Product Selector */}
                                        <Combobox
                                            value={assignment.productId}
                                            onChange={(value) => handleProductChange('requested', idx, value)}
                                            options={productsForCategory.map((product: any) => {
                                                // Calculate availability for this product
                                                const productItems = organizationItems.filter(i => i.product.id === product.id);
                                                const availableCount = productItems.filter(i => i.status === 'available').length;
                                                const hasStock = availableCount > 0;

                                                return {
                                                    value: product.id,
                                                    label: `${product.name} (${availableCount} disp.) ${!hasStock ? '🔴' : ''}`,
                                                    disabled: !hasStock
                                                };
                                            })}
                                            placeholder="Seleccionar producto..."
                                            className="w-full"
                                        />

                                        {/* Item Selector (only if product selected) */}
                                        {assignment.productId && (
                                            isSerialized ? (
                                                <Combobox
                                                    value={assignment.actualItemId}
                                                    onChange={(value) => {
                                                        const newAssignments = [...itemAssignments];
                                                        newAssignments[idx].actualItemId = value;
                                                        setItemAssignments(newAssignments);
                                                    }}
                                                    options={itemsForProduct.map((item: any) => {
                                                        const isAvailable = item.status === 'available';
                                                        return {
                                                            value: item.id,
                                                            label: `${item.identifier || 'Sin ID'} ${!isAvailable ? '🔴 (No disponible)' : ''}`,
                                                            disabled: !isAvailable
                                                        };
                                                    })}
                                                    placeholder="Seleccionar número de serie..."
                                                    className="w-full"
                                                />
                                            ) : (
                                                <div className="text-sm p-2 bg-muted rounded flex items-center gap-2">
                                                    {assignment.actualItemId ? (
                                                        <>
                                                            <Package className="h-4 w-4 text-green-600" />
                                                            <span>Item asignado automáticamente</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="h-4 w-4 text-red-600" />
                                                            <span className="text-red-600">No hay stock disponible para auto-asignación</span>
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Additional Items */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Material Adicional (Opcional)
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setAdditionalItems([...additionalItems, { categoryId: '', productId: '', actualItemId: '' }])
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Añadir Item
                            </Button>
                        </div>

                        {additionalItems.map((addItem, idx) => {
                            const productsForCategory = addItem.categoryId ? getProductsForCategory(addItem.categoryId) : [];
                            const itemsForProduct = addItem.productId ? getItemsForProduct(addItem.productId) : [];
                            const isSerialized = itemsForProduct.some(item => item.identifier);

                            return (
                                <div key={idx} className="flex gap-2 items-start">
                                    <div className="flex-1 grid gap-2">
                                        <Combobox
                                            value={addItem.categoryId}
                                            onChange={(value) => {
                                                const newItems = [...additionalItems];
                                                newItems[idx].categoryId = value;
                                                newItems[idx].productId = '';
                                                newItems[idx].actualItemId = '';
                                                setAdditionalItems(newItems);
                                            }}
                                            options={allCategories.map((cat: any) => ({
                                                value: cat.id,
                                                label: cat.name
                                            }))}
                                            placeholder="Seleccionar categoría..."
                                            className="w-full"
                                        />

                                        {addItem.categoryId && (
                                            <Combobox
                                                value={addItem.productId}
                                                onChange={(value) => handleProductChange('additional', idx, value)}
                                                options={productsForCategory.map((product: any) => {
                                                    const productItems = organizationItems.filter(i => i.product.id === product.id);
                                                    const availableCount = productItems.filter(i => i.status === 'available').length;
                                                    const hasStock = availableCount > 0;

                                                    return {
                                                        value: product.id,
                                                        label: `${product.name} (${availableCount} disp.) ${!hasStock ? '🔴' : ''}`,
                                                        disabled: !hasStock
                                                    };
                                                })}
                                                placeholder="Seleccionar producto..."
                                                className="w-full"
                                            />
                                        )}

                                        {addItem.productId && (
                                            isSerialized ? (
                                                <Combobox
                                                    value={addItem.actualItemId}
                                                    onChange={(value) => {
                                                        const newItems = [...additionalItems];
                                                        newItems[idx].actualItemId = value;
                                                        setAdditionalItems(newItems);
                                                    }}
                                                    options={itemsForProduct.map((item: any) => {
                                                        const isAvailable = item.status === 'available';
                                                        return {
                                                            value: item.id,
                                                            label: `${item.identifier || 'Sin ID'} ${!isAvailable ? '🔴 (No disponible)' : ''}`,
                                                            disabled: !isAvailable
                                                        };
                                                    })}
                                                    placeholder="Seleccionar número de serie..."
                                                    className="w-full"
                                                />
                                            ) : (
                                                <div className="text-sm p-2 bg-muted rounded flex items-center gap-2">
                                                    {addItem.actualItemId ? (
                                                        <>
                                                            <Package className="h-4 w-4 text-green-600" />
                                                            <span>Item asignado automáticamente</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="h-4 w-4 text-red-600" />
                                                            <span className="text-red-600">No hay stock disponible para auto-asignación</span>
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setAdditionalItems(additionalItems.filter((_, i) => i !== idx))}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? 'Entregando...' : 'Confirmar Entrega'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
