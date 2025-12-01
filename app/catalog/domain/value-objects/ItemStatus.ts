// Domain Layer - Value Objects
// Item Status Enum

export enum ItemStatus {
    AVAILABLE = 'available',
    RESERVED = 'reserved',
    IN_USE = 'in_use',
    MAINTENANCE = 'maintenance',
    SUBDIVIDED = 'subdivided',
    DONATED = 'donated',
    DISCARDED = 'discarded',
    LOST = 'lost',
    DISASSEMBLED = 'disassembled'
}

export const ItemStatusLabels: Record<ItemStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
    [ItemStatus.AVAILABLE]: { label: 'Disponible', variant: 'success' },
    [ItemStatus.RESERVED]: { label: 'Reservado', variant: 'warning' },
    [ItemStatus.IN_USE]: { label: 'En Uso', variant: 'warning' },
    [ItemStatus.MAINTENANCE]: { label: 'Mantenimiento', variant: 'secondary' },
    [ItemStatus.SUBDIVIDED]: { label: 'Subdividido', variant: 'secondary' },
    [ItemStatus.DONATED]: { label: 'Donado', variant: 'default' },
    [ItemStatus.DISCARDED]: { label: 'Desechado', variant: 'destructive' },
    [ItemStatus.LOST]: { label: 'Extraviado', variant: 'destructive' },
    [ItemStatus.DISASSEMBLED]: { label: 'Desensamblado', variant: 'secondary' }
}
