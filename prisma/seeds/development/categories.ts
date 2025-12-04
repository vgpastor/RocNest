// Development seed - Simplified Categories

import { PrismaClient } from '@prisma/client'
import type { SeedOrganization, SeedCategory } from '../shared/types'

// 7 main categories for climbing/caving equipment
const CATEGORIES = [
    {
        name: 'Cuerdas',
        slug: 'cuerdas',
        description: 'Cuerdas dinámicas, semiestáticas y estáticas para escalada y espeleología',
        icon: '🪢',
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Dinámica', 'Semiestática', 'Estática'], required: true },
                { name: 'diametro_mm', type: 'number', required: true },
                { name: 'longitud_m', type: 'number', required: true },
                { name: 'color', type: 'text', required: false },
                { name: 'fecha_fabricacion', type: 'date', required: false },
                { name: 'fecha_primera_revision', type: 'date', required: false },
            ],
        },
    },
    {
        name: 'Mosquetones',
        slug: 'mosquetones',
        description: 'Mosquetones HMS, asimétricos, ovalados y maillones de aluminio y acero',
        icon: '🔗',
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['HMS', 'Asimétrico', 'Simétrico', 'Maillon'], required: true },
                { name: 'material', type: 'select', options: ['Aluminio', 'Acero'], required: true },
                { name: 'seguro', type: 'select', options: ['Rosca', 'Automático', 'Recto', 'Sin seguro'], required: false },
                { name: 'resistencia_kn', type: 'number', required: false },
            ],
        },
    },
    {
        name: 'Sacas',
        slug: 'sacas',
        description: 'Mochilas y sacas de transporte de varios tamaños y colores',
        icon: '🎒',
        metadataSchema: {
            fields: [
                { name: 'capacidad_litros', type: 'number', required: true },
                { name: 'tipo', type: 'select', options: ['Transporte', 'Cuerda', 'Material', 'Personal'], required: false },
                { name: 'color', type: 'text', required: false },
                { name: 'impermeable', type: 'boolean', required: false },
            ],
        },
    },
    {
        name: 'Cintas',
        slug: 'cintas',
        description: 'Cintas express y anillos de diferentes materiales y longitudes',
        icon: '➰',
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Express', 'Anillo'], required: true },
                { name: 'longitud_cm', type: 'number', required: true },
                { name: 'material', type: 'select', options: ['Dyneema', 'Poliamida', 'Aramida'], required: true },
                { name: 'resistencia_kn', type: 'number', required: false },
            ],
        },
    },
    {
        name: 'Anclajes',
        slug: 'anclajes',
        description: 'Spits, parabolts y chapas en diferentes métricas y materiales',
        icon: '⚓',
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Spit', 'Parabolt', 'Chapa'], required: true },
                { name: 'metrica', type: 'text', required: false },
                { name: 'material', type: 'select', options: ['Acero', 'Inox', 'Acero galvanizado', 'Inox A4'], required: true },
                { name: 'longitud_mm', type: 'number', required: false },
            ],
        },
    },
    {
        name: 'Herramientas Automáticas',
        slug: 'herramientas-automaticas',
        description: 'Taladros, baterías, termómetros, medidores de CO2 y otros equipos técnicos',
        icon: '🔧',
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Taladro', 'Batería', 'Termómetro', 'Medidor CO2', 'Disco', 'Otros'], required: true },
                { name: 'voltaje', type: 'number', required: false },
                { name: 'capacidad_ah', type: 'number', required: false },
                { name: 'numero_serie', type: 'text', required: false },
            ],
        },
    },
    {
        name: 'Varios',
        slug: 'varios',
        description: 'Botiquines, sacas de instalación, arneses, cascos, descensores, bloqueadores y otros equipos',
        icon: '📦',
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Botiquín', 'Saca instalación', 'Arnés', 'Casco', 'Descensor', 'Bloqueador', 'Otro'], required: true },
                { name: 'talla', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'S/M', 'M/L', 'N/A'], required: false },
                { name: 'color', type: 'text', required: false },
            ],
        },
    },
]

export async function seedCategories(
    prisma: PrismaClient,
    organizations: SeedOrganization[]
): Promise<SeedCategory[]> {
    const categories: SeedCategory[] = []

    console.log(`   Creating ${CATEGORIES.length} category types for each organization...`)

    for (const org of organizations) {
        for (const catTemplate of CATEGORIES) {
            const existing = await prisma.category.findFirst({
                where: {
                    organizationId: org.id,
                    name: catTemplate.name,
                },
            })

            if (existing) {
                categories.push({
                    ...existing,
                    slug: catTemplate.slug,
                })
                continue
            }

            const category = await prisma.category.create({
                data: {
                    organizationId: org.id,
                    name: catTemplate.name,
                    description: catTemplate.description,
                    icon: catTemplate.icon,
                    requiresUniqueNumbering: true,
                    canBeComposite: catTemplate.slug === 'varios', // Solo "Varios" puede ser compuesto
                    canBeSubdivided: catTemplate.slug === 'cuerdas', // Solo cuerdas pueden subdividirse
                    metadataSchema: catTemplate.metadataSchema,
                },
            })

            categories.push({
                ...category,
                slug: catTemplate.slug,
            })
        }
    }

    return categories
}
