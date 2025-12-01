// Development seed - Categories based on real inventory

import { PrismaClient } from '@prisma/client'
import { INVENTORY_DATA, normalizeCategoryName } from './inventory-data'
import type { SeedOrganization, SeedCategory } from '../shared/types'

// Extract unique categories from inventory data
function getUniqueCategories() {
    const categoriesMap = new Map<string, { name: string; slug: string }>()

    for (const item of INVENTORY_DATA) {
        const slug = normalizeCategoryName(item.category)
        if (!categoriesMap.has(slug)) {
            categoriesMap.set(slug, {
                name: item.category,
                slug,
            })
        }
    }

    return Array.from(categoriesMap.values())
}

export async function seedCategories(
    prisma: PrismaClient,
    organizations: SeedOrganization[]
): Promise<SeedCategory[]> {
    const categories: SeedCategory[] = []
    const uniqueCategories = getUniqueCategories()

    console.log(`   Creating ${uniqueCategories.length} category types...`)

    for (const org of organizations) {
        // Create all categories for each organization
        for (const catTemplate of uniqueCategories) {
            const existing = await prisma.category.findFirst({
                where: {
                    organizationId: org.id,
                    slug: catTemplate.slug,
                },
            })

            if (existing) {
                categories.push(existing)
                continue
            }

            const category = await prisma.category.create({
                data: {
                    organizationId: org.id,
                    name: catTemplate.name,
                    slug: catTemplate.slug,
                    description: `Categoría de ${catTemplate.name}`,
                    icon: getIconForCategory(catTemplate.slug),
                    requiresUniqueNumbering: true,
                    canBeComposite: false,
                    metadataSchema: {
                        fields: [
                            { name: 'characteristics', type: 'text' },
                            { name: 'unit_price_eur', type: 'number' },
                            { name: 'item_number', type: 'number' },
                            { name: 'total_quantity', type: 'number' },
                        ],
                    },
                },
            })

            categories.push(category)
        }
    }

    return categories
}

// Helper to assign icons based on category
function getIconForCategory(slug: string): string {
    const iconMap: Record<string, string> = {
        'autosocorro': '🆘',
        'cuchillo': '🔪',
        'bolsa-tornilleria': '🔩',
        'martillo-especial': '🔨',
        'extractor-spits': '🔧',
        'llave-dinamometrica': '🔧',
        'parabolts-inox': '🔩',
        'chapistas': '📎',
        'etiquetas': '🏷️',
        'marcador-cuerdas': '✏️',
        'malla-secado': '🌬️',
        'bolsas-inventario': '🎒',
        'carros-transporte': '🛒',
        'herramienta-multiuso': '🛠️',
        'taladro-respaldo': '🔌',
        'baterias-extra': '🔋',
        'sellador': '🧪',
        'cinta-americana': '📏',
        'bridas-robustas': '🔗',
        'pilas-cr123a': '🔋',
        'luz-quimica': '💡',
        'baliza-estroboscopica': '🚨',
        'linterna-respaldo': '🔦',
        'aisladores-cuerda': '🛡️',
        'protector-cuerda': '🛡️',
        'alfombra-cuerda': '📐',
        'anillos-polipropileno': '⭕',
        'radio-pmr': '📻',
        'radio-profesional': '📡',
        'cables-antena-improvisada': '📡',
        'bolsa-estanca-comunicacion': '💼',
        'bidones-estancos': '🛢️',
        'mochila-tecnica': '🎒',
        'vendas-israelies': '🩹',
        'torniquete': '⚕️',
        'antiseptico': '💊',
        'guantes-nitrilo': '🧤',
        'maniqui-rescate': '🚑',
        'cuerda-vieja': '🪢',
        'anclajes-practica': '⚓',
        'checkpoints-rfid': '📱',
        'termometro-higrometro': '🌡️',
        'camara-almacen': '📹',
    }

    return iconMap[slug] || '📦'
}
