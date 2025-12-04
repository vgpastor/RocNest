// Organization Templates System
// Este archivo define los templates disponibles y proporciona la función principal para aplicarlos

import { PrismaClient } from '@prisma/client'
import { applyClimbingClubTemplate } from './climbing-club-template'

// Tipos de templates disponibles
export type TemplateType = 'empty' | 'climbing-club'

// Metadatos de cada template (para mostrar en el UI)
export const TEMPLATE_METADATA = {
    empty: {
        id: 'empty',
        name: 'Organización Vacía',
        description: 'Empezar desde cero sin datos predefinidos',
        icon: '📋',
        includes: [],
        estimatedTime: '< 1 segundo',
    },
    'climbing-club': {
        id: 'climbing-club',
        name: 'Club de Escalada/Espeleología',
        description: 'Plantilla completa lista para usar',
        icon: '🧗',
        includes: [
            '7 categorías predefinidas',
            'Checklists de revisión',
            '~40 productos de ejemplo',
            '~25 items de inventario',
        ],
        estimatedTime: '2-3 segundos',
    },
} as const

/**
 * Aplica un template a una organización recién creada
 * 
 * @param prisma - Cliente de Prisma (puede ser una transacción)
 * @param organizationId - ID de la organización
 * @param templateType - Tipo de template a aplicar
 */
export async function applyOrganizationTemplate(
    prisma: PrismaClient | any, // any para soportar transacciones
    organizationId: string,
    templateType: TemplateType
): Promise<void> {
    console.log(`Applying template "${templateType}" to organization ${organizationId}`)

    switch (templateType) {
        case 'empty':
            // No hacer nada, la organización queda vacía
            break

        case 'climbing-club':
            await applyClimbingClubTemplate(prisma, organizationId)
            break

        default:
            throw new Error(`Unknown template type: ${templateType}`)
    }

    console.log(`Template "${templateType}" applied successfully`)
}
