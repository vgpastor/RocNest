// Deliver Material Dialog - Admin Only
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { X, Package, Plus, Trash2 } from 'lucide-react';

interface Props {
    reservation: any;
    availableItems: any[];
    organizationId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeliverMaterialDialog({
    reservation,
    availableItems,
    organizationId,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Map requested items to selections
    const [itemAssignments, setItemAssignments] = useState(
        reservation.reservationItems.map((ri: any) => ({
            reservationItemId: ri.id,
            categoryId: ri.categoryId,
            categoryName: ri.category.name,
            requestedQuantity: ri.requestedQuantity,
            actualItemId: '',
        }))
    );

    // Additional items not originally requested
    const [additionalItems, setAdditionalItems] = useState<Array<{
        categoryId: string;
        actualItemId: string;
    }>>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate all requested items have assignments
            const unassigned = itemAssignments.filter(ia => !ia.actualItemId);
            if (unassigned.length > 0) {
                setError('Debes asignar un item a cada categoría solicitada');
                setLoading(false);
                return;
            }

            const response = await fetch(
                `/api/organizations/${organizationId}/reservations/${reservation.id}/deliver`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: itemAssignments.map(ia => ({
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

    const getAvailableItemsForCategory = (categoryId: string) => {
        return availableItems.filter(item => item.categoryId === categoryId);
    };

    const allCategories = Array.from(
        new Set([
            ...reservation.reservationItems.map((ri: any) => ri.categoryId),
            ...availableItems.map((item: any) => item.categoryId),
        ])
    );

    const getCategoryName = (categoryId: string) => {
        const item = reservation.reservationItems.find((ri: any) => ri.categoryId === categoryId);
        if (item) return item.category.name;
        const availItem = availableItems.find(ai => ai.categoryId === categoryId);
        return availItem?.category.name || 'Categoría desconocida';
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b p-6 flex items-center justify-between">
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

                        {itemAssignments.map((assignment, idx) => {
                            const availableForCategory = getAvailableItemsForCategory(assignment.categoryId);

                            return (
                                <div key={idx} className="p-4 border rounded-lg">
                                    <div className="mb-3">
                                        <div className="font-medium">{assignment.categoryName}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Cantidad solicitada: {assignment.requestedQuantity}
                                        </div>
                                    </div>

                                    <select
                                        value={assignment.actualItemId}
                                        onChange={(e) => {
                                            const newAssignments = [...itemAssignments];
                                            newAssignments[idx].actualItemId = e.target.value;
                                            setItemAssignments(newAssignments);
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                        required
                                    >
                                        <option value="">Seleccionar item disponible...</option>
                                        {availableForCategory.map((item: any) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} {item.identifier && `(${item.identifier})`}
                                            </option>
                                        ))}
                                    </select>

                                    {availableForCategory.length === 0 && (
                                        <div className="mt-2 text-sm text-amber-600">
                                            ⚠️ No hay items disponibles en esta categoría
                                        </div>
                                    )}
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
                                    setAdditionalItems([...additionalItems, { categoryId: '', actualItemId: '' }])
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Añadir Item
                            </Button>
                        </div>

                        {additionalItems.map((addItem, idx) => {
                            const availableForCategory = addItem.categoryId
                                ? getAvailableItemsForCategory(addItem.categoryId)
                                : [];

                            return (
                                <div key={idx} className="flex gap-2">
                                    <div className="flex-1 grid md:grid-cols-2 gap-2">
                                        <select
                                            value={addItem.categoryId}
                                            onChange={(e) => {
                                                const newItems = [...additionalItems];
                                                newItems[idx].categoryId = e.target.value;
                                                newItems[idx].actualItemId = ''; // Reset item selection
                                                setAdditionalItems(newItems);
                                            }}
                                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Seleccionar categoría...</option>
                                            {allCategories.map((catId) => (
                                                <option key={catId} value={catId}>
                                                    {getCategoryName(catId)}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            value={addItem.actualItemId}
                                            onChange={(e) => {
                                                const newItems = [...additionalItems];
                                                newItems[idx].actualItemId = e.target.value;
                                                setAdditionalItems(newItems);
                                            }}
                                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                            disabled={!addItem.categoryId}
                                        >
                                            <option value="">Seleccionar item...</option>
                                            {availableForCategory.map((item: any) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name} {item.identifier && `(${item.identifier})`}
                                                </option>
                                            ))}
                                        </select>
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
