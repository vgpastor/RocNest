// Return Material Dialog - Admin Only
'use client';

import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui';

interface DeliveredReservationItem {
    id: string;
    actualItemId: string | null;
    category: { name: string };
    actualItem: {
        product: { name: string } | null;
        name: string;
        identifier: string | null;
    } | null;
}

interface Reservation {
    id: string;
    reservationItems: DeliveredReservationItem[];
}

interface InspectionEntry {
    reservationItemId: string;
    categoryName: string;
    productName: string;
    itemName: string;
    identifier: string | null;
    status: 'ok' | 'needs_review' | 'damaged';
    notes: string;
}

interface Props {
    reservation: Reservation;
    organizationId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReturnMaterialDialog({
    reservation,
    organizationId,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [actualReturnDate, setActualReturnDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    // Get delivered items (items with actualItemId)
    const deliveredItems = reservation.reservationItems.filter((ri: DeliveredReservationItem) => ri.actualItemId);

    const [selectedForReturn, setSelectedForReturn] = useState<Set<string>>(new Set());

    const [inspections, setInspections] = useState<InspectionEntry[]>(
        deliveredItems.map((ri: DeliveredReservationItem) => ({
            reservationItemId: ri.id,
            categoryName: ri.category.name,
            productName: ri.actualItem!.product?.name ?? '',
            itemName: ri.actualItem!.name,
            identifier: ri.actualItem!.identifier,
            status: 'ok' as const,
            notes: '',
        }))
    );

    const toggleSelection = (id: string) => {
        const newSelection = new Set(selectedForReturn);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedForReturn(newSelection);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const today = new Date().toISOString().split('T')[0];
        if (actualReturnDate > today) {
            setError('La fecha de devolución no puede ser futura');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `/api/organizations/${organizationId}/reservations/${reservation.id}/return`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        actualReturnDate,
                        inspections: inspections
                            .filter((insp: InspectionEntry) => selectedForReturn.has(insp.reservationItemId))
                            .map((insp: InspectionEntry) => ({
                                reservationItemId: insp.reservationItemId,
                                status: insp.status,
                                notes: insp.notes.trim() || undefined,
                            })),
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al procesar la devolución');
            }

            onSuccess();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al procesar la devolución');
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: 'ok', label: 'OK - Perfecto estado', icon: CheckCircle, color: 'text-green-600' },
        { value: 'needs_review', label: 'Necesita Revisión', icon: AlertTriangle, color: 'text-amber-600' },
        { value: 'damaged', label: 'Dañado', icon: XCircle, color: 'text-red-600' },
    ];

    const getStatusCount = (status: string) => {
        return inspections.filter((i: InspectionEntry) => i.status === status).length;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-xl">
                <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold">Devolver Material</h2>
                        <p className="text-muted-foreground">Inspecciona cada item devuelto</p>
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

                    {/* Return Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha Real de Devolución</label>
                        <input
                            type="date"
                            value={actualReturnDate}
                            onChange={(e) => setActualReturnDate(e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary"
                            required
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Summary */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm font-medium mb-2">Resumen de Inspecciones</div>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>OK: {getStatusCount('ok')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <span>Revisar: {getStatusCount('needs_review')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span>Dañados: {getStatusCount('damaged')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Inspections */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Seleccionar Items a Devolver ({selectedForReturn.size}/{deliveredItems.length})</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (selectedForReturn.size === deliveredItems.length) {
                                        setSelectedForReturn(new Set());
                                    } else {
                                        setSelectedForReturn(new Set(deliveredItems.map((i: DeliveredReservationItem) => i.id)));
                                    }
                                }}
                            >
                                {selectedForReturn.size === deliveredItems.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                            </Button>
                        </div>

                        {inspections.map((inspection: InspectionEntry, idx: number) => {
                            const isSelected = selectedForReturn.has(inspection.reservationItemId);

                            return (
                                <div key={idx} className={`p-4 border border-border rounded-lg space-y-3 transition-colors ${isSelected ? 'bg-card' : 'bg-muted/30'}`}>
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelection(inspection.reservationItemId)}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium">
                                                <span className="text-muted-foreground mr-2">{inspection.categoryName} - {inspection.productName}:</span>
                                                {inspection.identifier || 'Sin ID'}
                                            </div>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="pl-7 space-y-3 animate-in fade-in slide-in-from-top-2">
                                            {/* Status Selection */}
                                            <div className="grid gap-2">
                                                {statusOptions.map((option) => {
                                                    const Icon = option.icon;
                                                    const isStatusSelected = inspection.status === option.value;

                                                    return (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => {
                                                                const newInspections = [...inspections];
                                                                newInspections[idx].status = option.value as InspectionEntry['status'];
                                                                setInspections(newInspections);
                                                            }}
                                                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${isStatusSelected
                                                                ? 'border-primary bg-primary/5'
                                                                : 'border-transparent bg-muted/50 hover:bg-muted'
                                                                }`}
                                                        >
                                                            <Icon className={`h-5 w-5 ${isStatusSelected ? 'text-primary' : option.color}`} />
                                                            <span className={isStatusSelected ? 'font-medium' : ''}>{option.label}</span>
                                                            {isStatusSelected && (
                                                                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Notes */}
                                            <textarea
                                                placeholder="Notas adicionales (opcional)"
                                                value={inspection.notes}
                                                onChange={(e) => {
                                                    const newInspections = [...inspections];
                                                    newInspections[idx].notes = e.target.value;
                                                    setInspections(newInspections);
                                                }}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || selectedForReturn.size === 0} className="flex-1">
                            {loading ? 'Procesando...' : `Devolver ${selectedForReturn.size} Items`}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
