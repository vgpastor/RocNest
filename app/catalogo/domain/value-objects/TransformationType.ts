// Domain Layer - Value Objects
// Transformation Type Enum

export enum TransformationType {
    SUBDIVISION = 'subdivision',
    DISASSEMBLY = 'disassembly',
    ASSEMBLY = 'assembly',
    DETERIORATION = 'deterioration',
    DONATION = 'donation',
    LOSS = 'loss',
    RECOVERY = 'recovery'
}

export const TransformationTypeLabels: Record<TransformationType, string> = {
    [TransformationType.SUBDIVISION]: 'Subdivisión',
    [TransformationType.DISASSEMBLY]: 'Desensamblaje',
    [TransformationType.ASSEMBLY]: 'Ensamblaje',
    [TransformationType.DETERIORATION]: 'Deterioro',
    [TransformationType.DONATION]: 'Donación',
    [TransformationType.LOSS]: 'Pérdida',
    [TransformationType.RECOVERY]: 'Recuperación'
}

export const TransformationTypeDescriptions: Record<TransformationType, string> = {
    [TransformationType.SUBDIVISION]: 'Dividir un item en múltiples items más pequeños',
    [TransformationType.DISASSEMBLY]: 'Desensamblar un item compuesto en sus componentes',
    [TransformationType.ASSEMBLY]: 'Ensamblar componentes en un item compuesto',
    [TransformationType.DETERIORATION]: 'Registrar deterioro parcial de un item',
    [TransformationType.DONATION]: 'Donar items a una ubicación o personas',
    [TransformationType.LOSS]: 'Registrar pérdida de items',
    [TransformationType.RECOVERY]: 'Recuperar items donados o perdidos'
}
