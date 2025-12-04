// New Reservation Form - Client Component
'use client';

import { Plus, Trash2, Calendar, MapPin, Users, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Combobox } from '@/components/ui';


interface Category {
    id: string;
    name: string;
    icon?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface Props {
    organizationId: string;
    currentUserId: string;
    isAdmin: boolean;
    categories: Category[];
    users: User[];
}

export default function NewReservationForm({
    organizationId,
    currentUserId,
    isAdmin,
    categories,
    users,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [responsibleUserId, setResponsibleUserId] = useState(currentUserId);
    const [additionalUserIds, setAdditionalUserIds] = useState<string[]>([]);
    const [startDate, setStartDate] = useState('');
    const [estimatedReturnDate, setEstimatedReturnDate] = useState('');
    const [purpose, setPurpose] = useState('');
    const [notes, setNotes] = useState('');

    // Dynamic arrays
    const [locations, setLocations] = useState<Array<{ location: string; description: string }>>([
        { location: '', description: '' },
    ]);

    const [items, setItems] = useState<Array<{ categoryId: string; requestedQuantity: number; notes: string }>>([
        { categoryId: '', requestedQuantity: 1, notes: '' },
    ]);

    // Calculate default dates (today + 7 days)
    const getDefaultDates = () => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return {
            start: today.toISOString().split('T')[0],
            end: nextWeek.toISOString().split('T')[0],
        };
    };

    // Set defaults on mount
    useState(() => {
        const defaults = getDefaultDates();
        setStartDate(defaults.start);
        setEstimatedReturnDate(defaults.end);
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate
            const validLocations = locations.filter(l => l.location.trim());
            const validItems = items.filter(i => i.categoryId && i.requestedQuantity > 0);

            if (validLocations.length === 0) {
                setError('Añade al menos una ubicación');
                setLoading(false);
                return;
            }

            if (validItems.length === 0) {
                setError('Añade al menos un item');
                setLoading(false);
                return;
            }

            const response = await fetch(`/api/organizations/${organizationId}/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    responsibleUserId,
                    startDate,
                    estimatedReturnDate,
                    purpose: purpose.trim() || undefined,
                    notes: notes.trim() || undefined,
                    additionalUserIds: additionalUserIds.length > 0 ? additionalUserIds : undefined,
                    locations: validLocations,
                    items: validItems,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al crear la reserva');
            }

            const reservation = await response.json();
            router.push(`/reservations/${reservation.id}`);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                    {error}
                </div>
            )}

            {/* Responsible User (Admin only) */}
            {isAdmin && (
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <Users className="h-4 w-4" />
                        Usuario Responsable
                    </label>
                    <Combobox
                        value={responsibleUserId}
                        onChange={setResponsibleUserId}
                        options={users.map(user => ({
                            value: user.id,
                            label: `${user.name} (${user.email})`
                        }))}
                        className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                        Como admin, puedes crear reservas para otros usuarios
                    </p>
                </div>
            )}

            {/* Additional Users */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Usuarios Adicionales (Opcional)
                </label>
                <select
                    multiple
                    value={additionalUserIds}
                    onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setAdditionalUserIds(selected);
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary min-h-[100px] bg-[var(--color-background)] text-[var(--color-foreground)]"
                >
                    {users.filter(u => u.id !== responsibleUserId).map(user => (
                        <option key={user.id} value={user.id} className="bg-[var(--color-background)] text-[var(--color-foreground)]">
                            {user.name}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-muted-foreground">
                    Mantén Ctrl/Cmd para seleccionar múltiples usuarios
                </p>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4" />
                        Fecha de Inicio
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4" />
                        Fecha Estimada de Devolución
                    </label>
                    <input
                        type="date"
                        value={estimatedReturnDate}
                        onChange={(e) => setEstimatedReturnDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
            </div>

            {/* Locations */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="h-4 w-4" />
                        Ubicaciones / Destinos
                    </label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setLocations([...locations, { location: '', description: '' }])}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Añadir Ubicación
                    </Button>
                </div>

                {locations.map((loc, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                placeholder="Ubicación (ej: Montserrat, Riglos...)"
                                value={loc.location}
                                onChange={(e) => {
                                    const newLocs = [...locations];
                                    newLocs[idx].location = e.target.value;
                                    setLocations(newLocs);
                                }}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Descripción (opcional)"
                                value={loc.description}
                                onChange={(e) => {
                                    const newLocs = [...locations];
                                    newLocs[idx].description = e.target.value;
                                    setLocations(newLocs);
                                }}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {locations.length > 1 && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => setLocations(locations.filter((_, i) => i !== idx))}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Items */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <Package className="h-4 w-4" />
                        Material Solicitado
                    </label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setItems([...items, { categoryId: '', requestedQuantity: 1, notes: '' }])}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Añadir Item
                    </Button>
                </div>

                {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                        <div className="flex-1 grid md:grid-cols-3 gap-2">
                            <Combobox
                                value={item.categoryId}
                                onChange={(value) => {
                                    const newItems = [...items];
                                    newItems[idx].categoryId = value;
                                    setItems(newItems);
                                }}
                                options={categories.map(cat => ({
                                    value: cat.id,
                                    label: cat.name
                                }))}
                                placeholder="Seleccionar categoría..."
                                className="min-w-[200px]"
                            />
                            <input
                                type="number"
                                min="1"
                                placeholder="Cantidad"
                                value={item.requestedQuantity}
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[idx].requestedQuantity = parseInt(e.target.value) || 1;
                                    setItems(newItems);
                                }}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Notas (opcional)"
                                value={item.notes}
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[idx].notes = e.target.value;
                                    setItems(newItems);
                                }}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {items.length > 1 && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => setItems(items.filter((_, i) => i !== idx))}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Purpose & Notes */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Propósito / Actividad</label>
                <input
                    type="text"
                    placeholder="¿Para qué necesitas el material?"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Notas Adicionales</label>
                <textarea
                    placeholder="Cualquier información adicional..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Creando...' : 'Crear Reserva'}
                </Button>
            </div>
        </form>
    );
}
