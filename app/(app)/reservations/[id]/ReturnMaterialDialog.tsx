// Return Material Dialog - Admin Only
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
    reservation: any;
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
    const deliveredItems = reservation.reservationItems.filter((ri: any) => ri.actualItemId);

    const [inspections, setInspections] = useState(
        deliveredItems.map((ri: any) => ({
            reservationItemId: ri.id,
            itemName: ri.actualItem.name,
            status: 'ok' as 'ok' | 'needs_review' | 'damaged',
            notes: '',
        }))
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                `/api/organizations/${organizationId}/reservations/${reservation.id}/return`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        actualReturnDate,
                        inspections: inspections.map(insp => ({
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
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: 'ok', label: 'OK - Perfecto estado', icon: CheckCircle, color: 'text-green-600' },
        { value: 'needs_review', label: 'Necesita Revisión', icon: AlertTriangle, color: 'text-amber-600' },
        { value: 'damaged', label: 'Dañado', icon: XCircle, color: 'text-red-600' },
    ];

    const getStatusCount = (status: string) => {
        return inspections.filter(i => i.status === status).length;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b p-6 flex items-center justify-between">
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
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            required
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
                        <h3 className="font-semibold">Inspeccionar Items ({deliveredItems.length})</h3>

                        {inspections.map((inspection, idx) => (
                            <div key={idx} className="p-4 border rounded-lg space-y-3">
                                <div className="font-medium">{inspection.itemName}</div>

                                {/* Status Selection */}
                                <div className="grid gap-2">
                                    {statusOptions.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = inspection.status === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    const newInspections = [...inspections];
                                                    newInspections[idx].status = option.value as any;
                                                    setInspections(newInspections);
                                                }}
                                                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${isSelected
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-transparent bg-muted/50 hover:bg-muted'
                                                    }`}
                                            >
                                                <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : option.color}`} />
                                                <span className={isSelected ? 'font-medium' : ''}>{option.label}</span>
                                                {isSelected && (
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
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? 'Procesando...' : 'Confirmar Devolución'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
