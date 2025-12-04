// Development seed - Checklist Templates for Categories

import { PrismaClient } from '@prisma/client'
import type { SeedCategory } from '../shared/types'

// Checklist templates for each category
const CHECKLIST_TEMPLATES = {
    cuerdas: [
        {
            name: 'Revisión Estándar de Cuerdas',
            description: 'Checklist básico para revisar el estado de cuerdas',
            items: [
                { id: 'check-1', label: 'Estado de la funda - Sin cortes ni abrasiones', type: 'checkbox', required: true },
                { id: 'check-2', label: 'Estado del alma - Sin dureza excesiva', type: 'checkbox', required: true },
                { id: 'check-3', label: 'Marcado visible y legible', type: 'checkbox', required: true },
                { id: 'check-4', label: 'Longitud correcta (verificar)', type: 'number', required: false },
                { id: 'check-5', label: 'Fecha última revisión actualizada', type: 'checkbox', required: true },
                { id: 'check-6', label: 'Sin zonas blandas o aplastadas', type: 'checkbox', required: true },
                { id: 'check-7', label: 'Observaciones adicionales', type: 'text', required: false },
            ],
        },
        {
            name: 'Revisión Profunda de Cuerdas',
            description: 'Checklist completo para cuerdas con más de 2 años',
            items: [
                { id: 'check-1', label: 'Estado de la funda - Detallado', type: 'checkbox', required: true },
                { id: 'check-2', label: 'Estado del alma - Palpación completa', type: 'checkbox', required: true },
                { id: 'check-3', label: 'Marcado visible', type: 'checkbox', required: true },
                { id: 'check-4', label: 'Diámetro uniforme (medición)', type: 'number', required: true },
                { id: 'check-5', label: 'Longitud exacta (metros)', type: 'number', required: true },
                { id: 'check-6', label: 'Sin zonas rígidas', type: 'checkbox', required: true },
                { id: 'check-7', label: 'Sin contaminación química', type: 'checkbox', required: true },
                { id: 'check-8', label: 'Fecha de fabricación visible', type: 'checkbox', required: false },
                { id: 'check-9', label: 'Recomendar retiro (si aplica)', type: 'checkbox', required: false },
                { id: 'check-10', label: 'Observaciones detalladas', type: 'text', required: false },
            ],
        },
    ],
    mosquetones: [
        {
            name: 'Revisión de Mosquetones',
            description: 'Checklist para verificar el estado de mosquetones',
            items: [
                { id: 'check-1', label: 'Apertura suave del gatillo', type: 'checkbox', required: true },
                { id: 'check-2', label: 'Cierre correcto y completo', type: 'checkbox', required: true },
                { id: 'check-3', label: 'Sin fisuras visibles', type: 'checkbox', required: true },
                { id: 'check-4', label: 'Sin desgaste excesivo en gatillo', type: 'checkbox', required: true },
                { id: 'check-5', label: 'Seguro funciona correctamente', type: 'checkbox', required: true },
                { id: 'check-6', label: 'Sin golpes o deformaciones', type: 'checkbox', required: true },
                { id: 'check-7', label: 'Observaciones', type: 'text', required: false },
            ],
        },
    ],
    sacas: [
        {
            name: 'Revisión de Sacas y Mochilas',
            description: 'Checklist para verificar el estado de sacas',
            items: [
                { id: 'check-1', label: 'Costuras en buen estado', type: 'checkbox', required: true },
                { id: 'check-2', label: 'Cremalleras funcionan correctamente', type: 'checkbox', required: true },
                { id: 'check-3', label: 'Sin roturas en la tela', type: 'checkbox', required: true },
                { id: 'check-4', label: 'Correas y asas en buen estado', type: 'checkbox', required: true },
                { id: 'check-5', label: 'Hebillas funcionales', type: 'checkbox', required: false },
                { id: 'check-6', label: 'Observaciones', type: 'text', required: false },
            ],
        },
    ],
    cintas: [
        {
            name: 'Revisión de Cintas y Anillos',
            description: 'Checklist para verificar el estado de cintas',
            items: [
                { id: 'check-1', label: 'Sin cortes ni abrasiones', type: 'checkbox', required: true },
                { id: 'check-2', label: 'Costuras intactas', type: 'checkbox', required: true },
                { id: 'check-3', label: 'Sin decoloración extrema (UV)', type: 'checkbox', required: true },
                { id: 'check-4', label: 'Sin dureza excesiva', type: 'checkbox', required: true },
                { id: 'check-5', label: 'Etiquetado legible', type: 'checkbox', required: false },
                { id: 'check-6', label: 'Observaciones', type: 'text', required: false },
            ],
        },
    ],
    anclajes: [
        {
            name: 'Revisión de Anclajes',
            description: 'Checklist para verificar el estado de spits, parabolts y chapas',
            items: [
                { id: 'check-1', label: 'Sin oxidación visible', type: 'checkbox', required: true },
                { id: 'check-2', label: 'Roscas en buen estado', type: 'checkbox', required: true },
                { id: 'check-3', label: 'Sin deformaciones', type: 'checkbox', required: true },
                { id: 'check-4', label: 'Cantidad correcta en stock', type: 'number', required: false },
                { id: 'check-5', label: 'Observaciones', type: 'text', required: false },
            ],
        },
    ],
    'herramientas-automaticas': [
        {
            name: 'Revisión de Herramientas Eléctricas',
            description: 'Checklist para taladros, baterías y equipos electrónicos',
            items: [
                { id: 'check-1', label: 'Funciona correctamente', type: 'checkbox', required: true },
                { id: 'check-2', label: 'Sin golpes ni daños visibles', type: 'checkbox', required: true },
                { id: 'check-3', label: 'Cable/batería en buen estado', type: 'checkbox', required: true },
                { id: 'check-4', label: 'Calibración correcta (si aplica)', type: 'checkbox', required: false },
                { id: 'check-5', label: 'Número de serie verificado', type: 'text', required: false },
                { id: 'check-6', label: 'Observaciones', type: 'text', required: false },
            ],
        },
    ],
    varios: [
        {
            name: 'Revisión de Equipo Diverso',
            description: 'Checklist genérico para arneses, cascos, descensores, etc.',
            items: [
                { id: 'check-1', label: 'Sin daños estructurales', type: 'checkbox', required: true },
                { id: 'check-2', label: 'Todas las partes móviles funcionan', type: 'checkbox', required: true },
                { id: 'check-3', label: 'Sin desgaste excesivo', type: 'checkbox', required: true },
                { id: 'check-4', label: 'Marcado/etiquetado visible', type: 'checkbox', required: false },
                { id: 'check-5', label: 'Fecha de fabricación conocida', type: 'checkbox', required: false },
                { id: 'check-6', label: 'Observaciones', type: 'text', required: false },
            ],
        },
    ],
}

export async function seedChecklistTemplates(
    prisma: PrismaClient,
    categories: SeedCategory[]
): Promise<void> {
    console.log('   Creating checklist templates...')

    let templatesCreated = 0

    for (const category of categories) {
        const templates = CHECKLIST_TEMPLATES[category.slug as keyof typeof CHECKLIST_TEMPLATES]

        if (!templates) continue

        for (const template of templates) {
            const existing = await prisma.categoryChecklistTemplate.findFirst({
                where: {
                    categoryId: category.id,
                    name: template.name,
                },
            })

            if (existing) continue

            await prisma.categoryChecklistTemplate.create({
                data: {
                    categoryId: category.id,
                    name: template.name,
                    description: template.description,
                    items: template.items,
                    isActive: true,
                },
            })

            templatesCreated++
        }
    }

    console.log(`   ${templatesCreated} checklist templates created`)
}
