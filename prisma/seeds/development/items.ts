// Development seed - Items using simplified product templates

import { PrismaClient } from '@prisma/client'

import type { SeedOrganization, SeedCategory, SeedItem } from '../shared/types'

import { expandProductTemplates, normalizeCategoryName } from './inventory-data'

// Helper to generate random quantities for each product
function getRandomQuantity(categorySlug: string): number {
    // Different quantities based on category
    switch (categorySlug) {
        case 'cuerdas':
            return Math.floor(Math.random() * 3) + 2 // 2-4 units per rope type
        case 'mosquetones':
            return Math.floor(Math.random() * 20) + 10 // 10-30 mosquetones
        case 'sacas':
            return Math.floor(Math.random() * 5) + 3 // 3-8 sacas
        case 'cintas':
            return Math.floor(Math.random() * 15) + 10 // 10-25 cintas
        case 'anclajes':
            return Math.floor(Math.random() * 30) + 20 // 20-50 anclajes
        case 'herramientas-automaticas':
            return Math.floor(Math.random() * 3) + 1 // 1-3 herramientas
        case 'varios':
            return Math.floor(Math.random() * 8) + 5 // 5-12 items varios
        default:
            return Math.floor(Math.random() * 5) + 1
    }
}

// Helper to determine item status (most available, some in use or maintenance)
function getRandomStatus(): string {
    const rand = Math.random()
    if (rand < 0.70) return 'available' // 70%
    if (rand < 0.85) return 'in_use' // 15%
    if (rand < 0.95) return 'maintenance' // 10%
    return 'reserved' // 5%
}

// Helper to build metadata from product characteristics
function buildItemMetadata(
    productFullName: string,
    characteristics: string,
    categorySlug: string
): Record<string, unknown> {
    const metadata: Record<string, unknown> = {}

    // Extract information from fullName and characteristics
    switch (categorySlug) {
        case 'cuerdas':
            // Extract diameter and length
            const diamMatch = productFullName.match(/(\d+\.?\d*)mm/)
            const lengthMatch = productFullName.match(/(\d+)m/)
            const colorMatch = productFullName.match(/(Azul|Verde|Rojo|Naranja|Negro|Blanco\/Negro|Rojo\/Negro|Azul\/Negro|Blanco)$/)
            
            if (productFullName.includes('dinámica')) metadata.tipo = 'Dinámica'
            else if (productFullName.includes('semiestática') || productFullName.includes('Semiestática')) metadata.tipo = 'Semiestática'
            else if (productFullName.includes('estática') || productFullName.includes('Estática')) metadata.tipo = 'Estática'
            
            if (diamMatch) metadata.diametro_mm = parseFloat(diamMatch[1])
            if (lengthMatch) metadata.longitud_m = parseInt(lengthMatch[1])
            if (colorMatch) metadata.color = colorMatch[1]
            
            // Random fabrication date (last 5 years)
            const fabDate = new Date()
            fabDate.setFullYear(fabDate.getFullYear() - Math.floor(Math.random() * 5))
            metadata.fecha_fabricacion = fabDate.toISOString().split('T')[0]
            break

        case 'mosquetones':
            if (productFullName.includes('HMS')) metadata.tipo = 'HMS'
            else if (productFullName.includes('asimétrico')) metadata.tipo = 'Asimétrico'
            else if (productFullName.includes('ovalado') || productFullName.includes('Ovalone')) metadata.tipo = 'Simétrico'
            else if (productFullName.includes('Maillon') || productFullName.includes('Oxan')) metadata.tipo = 'Maillon'
            
            if (productFullName.includes('Aluminio')) metadata.material = 'Aluminio'
            else if (productFullName.includes('Acero')) metadata.material = 'Acero'
            
            if (productFullName.includes('automático')) metadata.seguro = 'Automático'
            else if (characteristics.includes('rosca')) metadata.seguro = 'Rosca'
            
            metadata.resistencia_kn = Math.floor(Math.random() * 15) + 20 // 20-35 kN
            break

        case 'sacas':
            const capacityMatch = productFullName.match(/(\d+)L/)
            if (capacityMatch) metadata.capacidad_litros = parseInt(capacityMatch[1])
            
            if (productFullName.includes('Bucket')) metadata.tipo = 'Transporte'
            else if (productFullName.includes('Rope')) metadata.tipo = 'Cuerda'
            else metadata.tipo = 'Material'
            
            const sacaColorMatch = productFullName.match(/(Amarillo|Rojo|Negro|Azul|Verde)/)
            if (sacaColorMatch) metadata.color = sacaColorMatch[1]
            
            metadata.impermeable = Math.random() > 0.5
            break

        case 'cintas':
            const cintaLengthMatch = productFullName.match(/(\d+)cm/)
            if (cintaLengthMatch) metadata.longitud_cm = parseInt(cintaLengthMatch[1])
            
            if (productFullName.includes('Express')) metadata.tipo = 'Express'
            else metadata.tipo = 'Anillo'
            
            if (productFullName.includes('Dyneema')) metadata.material = 'Dyneema'
            else if (productFullName.includes('Aramid')) metadata.material = 'Aramida'
            else if (productFullName.includes('Nylon')) metadata.material = 'Poliamida'
            
            metadata.resistencia_kn = Math.floor(Math.random() * 10) + 20 // 20-30 kN
            break

        case 'anclajes':
            if (productFullName.includes('Spit')) metadata.tipo = 'Spit'
            else if (productFullName.includes('Parabolt')) metadata.tipo = 'Parabolt'
            else metadata.tipo = 'Chapa'
            
            const metricMatch = productFullName.match(/(\d+x\d+)/)
            if (metricMatch) metadata.metrica = metricMatch[1]
            
            const mmMatch = productFullName.match(/(\d+)mm/)
            if (mmMatch) metadata.longitud_mm = parseInt(mmMatch[1])
            
            if (productFullName.includes('Inox A4')) metadata.material = 'Inox A4'
            else if (productFullName.includes('Inox')) metadata.material = 'Inox'
            else if (productFullName.includes('galvanizado')) metadata.material = 'Acero galvanizado'
            else metadata.material = 'Acero'
            break

        case 'herramientas-automaticas':
            if (productFullName.includes('Hilti') || productFullName.includes('Bosch') || productFullName.includes('Makita')) {
                metadata.tipo = 'Taladro'
                metadata.voltaje = productFullName.includes('36') ? 36 : 18
            } else if (productFullName.includes('Batería')) {
                metadata.tipo = 'Batería'
                metadata.voltaje = 36
                metadata.capacidad_ah = 6.0
            } else if (productFullName.includes('Temp')) {
                metadata.tipo = 'Termómetro'
            } else if (productFullName.includes('CO2')) {
                metadata.tipo = 'Medidor CO2'
            } else if (productFullName.includes('Disco')) {
                metadata.tipo = 'Disco'
            } else {
                metadata.tipo = 'Otros'
            }
            
            metadata.numero_serie = `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            break

        case 'varios':
            if (productFullName.includes('Botiquín') || productFullName.includes('First Aid')) {
                metadata.tipo = 'Botiquín'
            } else if (productFullName.includes('Installation Bag')) {
                metadata.tipo = 'Saca instalación'
            } else if (productFullName.includes('Corax') || productFullName.includes('Arnés')) {
                metadata.tipo = 'Arnés'
            } else if (productFullName.includes('Boreo') || productFullName.includes('Vision') || productFullName.includes('Casco')) {
                metadata.tipo = 'Casco'
            } else if (productFullName.includes('Grigri') || productFullName.includes('Stop')) {
                metadata.tipo = 'Descensor'
            } else if (productFullName.includes('Ascension') || productFullName.includes('Basic')) {
                metadata.tipo = 'Bloqueador'
            } else {
                metadata.tipo = 'Otro'
            }
            
            // Extract size
            const sizeMatch = productFullName.match(/(XS|S\/M|M\/L|S|M|L|XL)/)
            if (sizeMatch) metadata.talla = sizeMatch[1]
            else metadata.talla = 'N/A'
            
            // Extract color
            const variosColorMatch = productFullName.match(/(Blanco|Negro|Rojo|Azul|Gris|Verde|Amarillo)/)
            if (variosColorMatch) metadata.color = variosColorMatch[1]
            break
    }

    return metadata
}

export async function seedItems(
    prisma: PrismaClient,
    organizations: SeedOrganization[],
    categories: SeedCategory[]
): Promise<SeedItem[]> {
    const items: SeedItem[] = []

    console.log('   Generating products from templates...')
    const expandedProducts = expandProductTemplates()
    console.log(`   ${expandedProducts.length} product variants generated`)

    // Group categories by organization and slug
    const categoriesByOrgAndSlug: Record<string, Record<string, SeedCategory>> = {}
    for (const category of categories) {
        if (!categoriesByOrgAndSlug[category.organizationId]) {
            categoriesByOrgAndSlug[category.organizationId] = {}
        }
        categoriesByOrgAndSlug[category.organizationId][category.slug] = category
    }

    // Global item counter
    let globalItemCounter = 0

    // For each organization
    for (const org of organizations) {
        console.log(`   Creating items for organization: ${org.name}`)
        const orgCategories = categoriesByOrgAndSlug[org.id] || {}

        // For each expanded product, create the product and items
        for (const productData of expandedProducts) {
            const categorySlug = normalizeCategoryName(productData.category)
            const category = orgCategories[categorySlug]

            if (!category) {
                continue
            }

            // Create or find the Product
            let product = await prisma.product.findFirst({
                where: {
                    organizationId: org.id,
                    name: productData.fullName,
                    categoryId: category.id,
                },
            })

            if (!product) {
                product = await prisma.product.create({
                    data: {
                        organizationId: org.id,
                        categoryId: category.id,
                        brand: productData.brand,
                        model: productData.model,
                        name: productData.fullName,
                        description: productData.characteristics,
                        metadata: {
                            price: productData.price,
                        },
                    },
                })
            }

            // Determine how many items to create for this product
            const quantity = getRandomQuantity(categorySlug)

            // Create individual items
            for (let i = 0; i < quantity; i++) {
                globalItemCounter++
                const identifier = `${categorySlug.toUpperCase().substring(0, 3)}-${String(globalItemCounter).padStart(4, '0')}`

                // Check if already exists
                const existing = await prisma.item.findUnique({
                    where: { identifier },
                })

                if (existing) {
                    items.push(existing as unknown as SeedItem)
                    continue
                }

                const status = getRandomStatus()
                const metadata = buildItemMetadata(productData.fullName, productData.characteristics, categorySlug)

                const item = await prisma.item.create({
                    data: {
                        organizationId: org.id,
                        productId: product.id,
                        status,
                        identifier,
                        hasUniqueNumbering: true,
                        isComposite: false,
                        metadata,
                    },
                })

                items.push(item as unknown as SeedItem)
            }
        }
    }

    return items
}
