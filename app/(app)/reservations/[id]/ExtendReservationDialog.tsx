// Extend Reservation Dialog - Admin Only
'use client';

import { X, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui';

interface Reservation {
    id: string;
    estimatedReturnDate: string;
    extensions: Array<{ extensionDays: number; motivation: string; createdAt: string }>;
}

interface Props {
    reservation: Reservation;
    organizationId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ExtendReservationDialog({
    reservation,
    organizationId,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [extensionDays, setExtensionDays] = useState(7); // Default 7 days
    const [motivation, setMotivation] = useState('');

    const currentReturnDate = new Date(reservation.estimatedReturnDate);
    const newReturnDate = new Date(currentReturnDate);
    newReturnDate.setDate(currentReturnDate.getDate() + extensionDays);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!motivation.trim()) {
                setError('La motivación es obligatoria');
                setLoading(false);
                return;
            }

            if (extensionDays <= 0) {
                setError('Los días de extensión deben ser mayores a 0');
                setLoading(false);
                return;
            }

            const response = await fetch(
                `/api/organizations/${organizationId}/reservations/${reservation.id}/extend`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        extensionDays,
                        motivation: motivation.trim(),
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al ampliar la reserva');
            }

            onSuccess();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al ampliar la reserva');
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const quickOptions = [
        { days: 3, label: '3 días' },
        { days: 7, label: '1 semana' },
        { days: 14, label: '2 semanas' },
        { days: 30, label: '1 mes' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full">
                <div className="border-b p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <TrendingUp className="h-6 w-6" />
                            Ampliar Reserva
                        </h2>
                        <p className="text-muted-foreground">Extiende el período de la reserva</p>
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

                    {/* Current Info */}
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Fecha de devolución actual:</span>
                            <span className="font-medium">{formatDate(currentReturnDate)}</span>
                        </div>
                        {reservation.extensions.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                                Esta reserva ya ha sido ampliada {reservation.extensions.length}{' '}
                                {reservation.extensions.length === 1 ? 'vez' : 'veces'}
                            </div>
                        )}
                    </div>

                    {/* Extension Days */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Días de Extensión</label>

                        {/* Quick Options */}
                        <div className="grid grid-cols-4 gap-2">
                            {quickOptions.map((option) => (
                                <button
                                    key={option.days}
                                    type="button"
                                    onClick={() => setExtensionDays(option.days)}
                                    className={`px-4 py-2 rounded-lg border-2 transition-all ${extensionDays === option.days
                                            ? 'border-primary bg-primary/5 font-medium'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* Custom Input */}
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max="365"
                                value={extensionDays}
                                onChange={(e) => setExtensionDays(parseInt(e.target.value) || 1)}
                                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-sm text-muted-foreground">días</span>
                        </div>
                    </div>

                    {/* New Return Date Preview */}
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                                <div className="text-sm text-muted-foreground">Nueva fecha de devolución:</div>
                                <div className="text-lg font-bold text-primary">{formatDate(newReturnDate)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Motivation */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Motivación <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                            placeholder="¿Por qué se necesita ampliar esta reserva?"
                            rows={4}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            La motivación quedará registrada en el historial de la reserva
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? 'Ampliando...' : `Ampliar ${extensionDays} ${extensionDays === 1 ? 'día' : 'días'}`}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
