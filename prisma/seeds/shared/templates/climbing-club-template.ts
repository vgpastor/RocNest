// Template: Club de Escalada/Espeleología
// Este archivo contiene toda la configuración del template
// Es fácil de modificar: añade/elimina categorías, productos o checklist items

import { Prisma, PrismaClient } from '@prisma/client'

// ============================================
// CONFIGURACIÓN DEL TEMPLATE
// Modifica esta sección para cambiar el contenido
// ============================================

// 1. CATEGORÍAS (7 categorías predefinidas)
const CATEGORIES = [
    {
        name: 'Cuerdas',
        description: 'Cuerdas dinámicas, semiestáticas y estáticas para escalada y espeleología',
        icon: '🪢',
        canBeSubdivided: true,
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Dinámica', 'Semiestática', 'Estática'], required: true },
                { name: 'diametro_mm', type: 'number', required: true },
                { name: 'longitud_m', type: 'number', required: true },
                { name: 'color', type: 'text', required: false },
            ],
        },
    },
    {
        name: 'Mosquetones',
        description: 'Mosquetones HMS, asimétricos, ovalados y maillones',
        icon: '🔗',
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['HMS', 'Asimétrico', 'Simétrico', 'Maillon'], required: true },
                { name: 'material', type: 'select', options: ['Aluminio', 'Acero'], required: true },
                { name: 'resistencia_kn', type: 'number', required: false },
            ],
        },
    },
    {
        name: 'Sacas',
        description: 'Mochilas y sacas de transporte',
        icon: '🎒',
        metadataSchema: {
            fields: [
                { name: 'capacidad_litros', type: 'number', required: true },
                { name: 'tipo', type: 'select', options: ['Transporte', 'Cuerda', 'Material', 'Personal'], required: false },
            ],
        },
    },
    {
        name: 'Cintas',
        description: 'Cintas express y anillos',
        icon: '➰',
        metadataSchema: {
            fields: [
                { name: 'longitud_cm', type: 'number', required: true },
                { name: 'material', type: 'select', options: ['Dyneema', 'Poliamida', 'Aramida'], required: true },
            ],
        },
    },
    {
        name: 'Anclajes',
        description: 'Spits, parabolts y chapas',
        icon: '⚓',
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Spit', 'Parabolt', 'Chapa'], required: true },
                { name: 'material', type: 'select', options: ['Acero', 'Inox', 'Acero galvanizado', 'Inox A4'], required: true },
            ],
        },
    },
    {
        name: 'Herramientas Automáticas',
        description: 'Taladros, baterías y equipos técnicos',
        icon: '🔧',
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Taladro', 'Batería', 'Termómetro', 'Medidor CO2', 'Otros'], required: true },
            ],
        },
    },
    {
        name: 'Varios',
        description: 'Arneses, cascos, descensores, bloqueadores y otros equipos',
        icon: '📦',
        canBeComposite: true,
        metadataSchema: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Arnés', 'Casco', 'Descensor', 'Bloqueador', 'Botiquín', 'Otro'], required: true },
                { name: 'talla', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'S/M', 'M/L', 'N/A'], required: false },
            ],
        },
    },
]

// 2. CHECKLIST TEMPLATES (simplificados para el template)
const CHECKLIST_TEMPLATES = {
    'Cuerdas': {
        name: 'Revisión de Cuerdas',
        description: 'Checklist para verificar el estado de cuerdas',
        items: [
            { id: 'check-1', label: 'Estado de la funda - Sin cortes ni abrasiones', type: 'checkbox', required: true },
            { id: 'check-2', label: 'Estado del alma - Sin dureza excesiva', type: 'checkbox', required: true },
            { id: 'check-3', label: 'Marcado visible y legible', type: 'checkbox', required: true },
            { id: 'check-4', label: 'Sin zonas blandas o aplastadas', type: 'checkbox', required: true },
        ],
    },
    'Mosquetones': {
        name: 'Revisión de Mosquetones',
        description: 'Checklist para verificar el estado de mosquetones',
        items: [
            { id: 'check-1', label: 'Apertura suave del gatillo', type: 'checkbox', required: true },
            { id: 'check-2', label: 'Cierre correcto y completo', type: 'checkbox', required: true },
            { id: 'check-3', label: 'Sin fisuras visibles', type: 'checkbox', required: true },
        ],
    },
    'Sacas': {
        name: 'Revisión de Sacas',
        description: 'Checklist para verificar el estado de sacas',
        items: [
            { id: 'check-1', label: 'Costuras en buen estado', type: 'checkbox', required: true },
            { id: 'check-2', label: 'Cremalleras funcionan correctamente', type: 'checkbox', required: true },
            { id: 'check-3', label: 'Sin roturas en la tela', type: 'checkbox', required: true },
        ],
    },
    'Cintas': {
        name: 'Revisión de Cintas',
        description: 'Checklist para verificar el estado de cintas',
        items: [
            { id: 'check-1', label: 'Sin cortes ni abrasiones', type: 'checkbox', required: true },
            { id: 'check-2', label: 'Costuras intactas', type: 'checkbox', required: true },
        ],
    },
    'Anclajes': {
        name: 'Revisión de Anclajes',
        description: 'Checklist para verificar el estado de anclajes',
        items: [
            { id: 'check-1', label: 'Sin oxidación visible', type: 'checkbox', required: true },
            { id: 'check-2', label: 'Roscas en buen estado', type: 'checkbox', required: true },
        ],
    },
    'Herramientas Automáticas': {
        name: 'Revisión de Herramientas',
        description: 'Checklist para verificar el estado de herramientas',
        items: [
            { id: 'check-1', label: 'Funciona correctamente', type: 'checkbox', required: true },
            { id: 'check-2', label: 'Sin golpes ni daños visibles', type: 'checkbox', required: true },
        ],
    },
    'Varios': {
        name: 'Revisión de Equipo Diverso',
        description: 'Checklist genérico para equipo diverso',
        items: [
            { id: 'check-1', label: 'Sin daños estructurales', type: 'checkbox', required: true },
            { id: 'check-2', label: 'Todas las partes móviles funcionan', type: 'checkbox', required: true },
        ],
    },
}

// 3. PRODUCTOS DE EJEMPLO (selección reducida y representativa)
const SAMPLE_PRODUCTS = [
    // Cuerdas (5 productos)
    { category: 'Cuerdas', brand: 'Petzl', model: 'Volta 9.2mm 60m', name: 'Petzl Volta 9.2mm 60m Azul', description: 'Cuerda dinámica para escalada', metadata: { tipo: 'Dinámica', diametro_mm: 9.2, longitud_m: 60, color: 'Azul' }, quantity: 2 },
    { category: 'Cuerdas', brand: 'Beal', model: 'Karma 9.8mm 70m', name: 'Beal Karma 9.8mm 70m Verde', description: 'Cuerda dinámica versátil', metadata: { tipo: 'Dinámica', diametro_mm: 9.8, longitud_m: 70, color: 'Verde' }, quantity: 2 },
    { category: 'Cuerdas', brand: 'Edelrid', model: 'Swift 10.5mm 50m', name: 'Edelrid Swift 10.5mm 50m Negro', description: 'Cuerda semiestática', metadata: { tipo: 'Semiestática', diametro_mm: 10.5, longitud_m: 50, color: 'Negro' }, quantity: 3 },
    { category: 'Cuerdas', brand: 'Fixe', model: 'Fanatic 10mm 100m', name: 'Fixe Fanatic 10mm 100m Blanco/Negro', description: 'Cuerda semiestática para espeleología', metadata: { tipo: 'Semiestática', diametro_mm: 10, longitud_m: 100, color: 'Blanco/Negro' }, quantity: 2 },
    { category: 'Cuerdas', brand: 'Tendon', model: 'Static 11mm 100m', name: 'Tendon Static 11mm 100m Blanco', description: 'Cuerda estática trabajos verticales', metadata: { tipo: 'Estática', diametro_mm: 11, longitud_m: 100, color: 'Blanco' }, quantity: 1 },
    
    // Mosquetones (6 productos)
    { category: 'Mosquetones', brand: 'Petzl', model: 'Attache', name: 'Petzl Attache Aluminio', description: 'Mosquetón HMS con seguro de rosca', metadata: { tipo: 'HMS', material: 'Aluminio', resistencia_kn: 25 }, quantity: 10 },
    { category: 'Mosquetones', brand: 'Black Diamond', model: 'RockLock', name: 'Black Diamond RockLock Aluminio', description: 'Mosquetón HMS screwgate', metadata: { tipo: 'HMS', material: 'Aluminio', resistencia_kn: 24 }, quantity: 8 },
    { category: 'Mosquetones', brand: 'DMM', model: 'XSRE', name: 'DMM XSRE Aluminio', description: 'Mosquetón asimétrico ligero', metadata: { tipo: 'Asimétrico', material: 'Aluminio', resistencia_kn: 22 }, quantity: 12 },
    { category: 'Mosquetones', brand: 'Climbing Technology', model: 'Concept SGL', name: 'Climbing Technology Concept SGL Aluminio', description: 'Mosquetón automático', metadata: { tipo: 'Asimétrico', material: 'Aluminio', resistencia_kn: 23 }, quantity: 6 },
    { category: 'Mosquetones', brand: 'Kong', model: 'Ovalone', name: 'Kong Ovalone Aluminio', description: 'Mosquetón ovalado simétrico', metadata: { tipo: 'Simétrico', material: 'Aluminio', resistencia_kn: 25 }, quantity: 10 },
    { category: 'Mosquetones', brand: 'Petzl', model: 'Oxan', name: 'Petzl Oxan Acero', description: 'Maillon acero alta resistencia', metadata: { tipo: 'Maillon', material: 'Acero', resistencia_kn: 35 }, quantity: 15 },
    
    // Sacas (4 productos)
    { category: 'Sacas', brand: 'Petzl', model: 'Bucket 35L', name: 'Petzl Bucket 35L Amarillo', description: 'Saca de transporte resistente', metadata: { capacidad_litros: 35, tipo: 'Transporte' }, quantity: 3 },
    { category: 'Sacas', brand: 'Beal', model: 'Combi 45L', name: 'Beal Combi 45L Azul', description: 'Mochila-saca convertible', metadata: { capacidad_litros: 45, tipo: 'Cuerda' }, quantity: 2 },
    { category: 'Sacas', brand: 'Rodcle', model: 'Pit Rope 60L', name: 'Rodcle Pit Rope 60L Verde', description: 'Saca específica para cuerdas', metadata: { capacidad_litros: 60, tipo: 'Cuerda' }, quantity: 3 },
    { category: 'Sacas', brand: 'Singing Rock', model: 'Rope Bag 80L', name: 'Singing Rock Rope Bag 80L Negro', description: 'Saca de cuerda con lona', metadata: { capacidad_litros: 80, tipo: 'Cuerda' }, quantity: 2 },
    
    // Cintas (4 productos)
    { category: 'Cintas', brand: 'Petzl', model: 'Express 60cm', name: 'Petzl Express 60cm Dyneema', description: 'Cinta express para reuniones', metadata: { longitud_cm: 60, material: 'Dyneema' }, quantity: 10 },
    { category: 'Cintas', brand: 'Petzl', model: 'Express 120cm', name: 'Petzl Express 120cm Dyneema', description: 'Cinta express larga', metadata: { longitud_cm: 120, material: 'Dyneema' }, quantity: 8 },
    { category: 'Cintas', brand: 'Edelrid', model: 'Aramid 120cm', name: 'Edelrid Aramid 120cm Aramida', description: 'Anillo de cordino resistente', metadata: { longitud_cm: 120, material: 'Aramida' }, quantity: 15 },
    { category: 'Cintas', brand: 'Fixe', model: 'Dyneema 240cm', name: 'Fixe Dyneema 240cm Dyneema', description: 'Anillo ultraligero', metadata: { longitud_cm: 240, material: 'Dyneema' }, quantity: 10 },
    
    // Anclajes (8 productos)
    { category: 'Anclajes', brand: 'Fixe', model: 'Spit 8mm Acero', name: 'Fixe Spit 8mm Acero', description: 'Spit de expansión 8mm', metadata: { tipo: 'Spit', material: 'Acero' }, quantity: 50 },
    { category: 'Anclajes', brand: 'Fixe', model: 'Spit 10mm Inox', name: 'Fixe Spit 10mm Inox', description: 'Spit de expansión 10mm inoxidable', metadata: { tipo: 'Spit', material: 'Inox' }, quantity: 30 },
    { category: 'Anclajes', brand: 'Fixe', model: 'Parabolt 8x80 Galv', name: 'Fixe Parabolt 8x80 Galvanizado', description: 'Parabolt químico 8x80mm', metadata: { tipo: 'Parabolt', material: 'Acero galvanizado' }, quantity: 40 },
    { category: 'Anclajes', brand: 'Fixe', model: 'Parabolt 10x100 Inox', name: 'Fixe Parabolt 10x100 Inox A4', description: 'Parabolt químico 10x100mm', metadata: { tipo: 'Parabolt', material: 'Inox A4' }, quantity: 30 },
    { category: 'Anclajes', brand: 'Fixe', model: 'Parabolt 10x120 Inox', name: 'Fixe Parabolt 10x120 Inox A4', description: 'Parabolt químico 10x120mm', metadata: { tipo: 'Parabolt', material: 'Inox A4' }, quantity: 20 },
    { category: 'Anclajes', brand: 'Fixe', model: 'Parabolt 12x140 Inox', name: 'Fixe Parabolt 12x140 Inox A4', description: 'Parabolt químico 12x140mm reuniones', metadata: { tipo: 'Parabolt', material: 'Inox A4' }, quantity: 15 },
    { category: 'Anclajes', brand: 'Petzl', model: 'Coeur Bolt', name: 'Petzl Coeur Bolt Inox', description: 'Chapa fija anclaje', metadata: { tipo: 'Chapa', material: 'Acero Inox' }, quantity: 25 },
    { category: 'Anclajes', brand: 'Raumer', model: 'Steel Hanger', name: 'Raumer Steel Hanger Inox', description: 'Chapa acero alta resistencia', metadata: { tipo: 'Chapa', material: 'Acero Inox' }, quantity: 20 },
    
    // Herramientas (3 productos)
    { category: 'Herramientas Automáticas', brand: 'Hilti', model: 'TE 7-A36', name: 'Hilti TE 7-A36', description: 'Martillo perforador a batería', metadata: { tipo: 'Taladro' }, quantity: 1 },
    { category: 'Herramientas Automáticas', brand: 'Bosch', model: 'GBH 18V-26', name: 'Bosch GBH 18V-26', description: 'Martillo perforador profesional', metadata: { tipo: 'Taladro' }, quantity: 1 },
    { category: 'Herramientas Automáticas', brand: 'Xiaomi', model: 'Temp & Humidity', name: 'Xiaomi Temp & Humidity', description: 'Termómetro e higrómetro digital', metadata: { tipo: 'Termómetro' }, quantity: 2 },
    
    // Varios (8 productos)
    { category: 'Varios', brand: 'Tatonka', model: 'First Aid Completo', name: 'Tatonka First Aid Completo', description: 'Botiquín completo primeros auxilios', metadata: { tipo: 'Botiquín', talla: 'N/A' }, quantity: 2 },
    { category: 'Varios', brand: 'Petzl', model: 'Corax M', name: 'Petzl Corax M', description: 'Arnés de escalada ajustable', metadata: { tipo: 'Arnés', talla: 'M' }, quantity: 3 },
    { category: 'Varios', brand: 'Petzl', model: 'Corax L', name: 'Petzl Corax L', description: 'Arnés de escalada ajustable', metadata: { tipo: 'Arnés', talla: 'L' }, quantity: 3 },
    { category: 'Varios', brand: 'Petzl', model: 'Boreo M/L Blanco', name: 'Petzl Boreo M/L Blanco', description: 'Casco de escalada y espeleología', metadata: { tipo: 'Casco', talla: 'M/L' }, quantity: 5 },
    { category: 'Varios', brand: 'Black Diamond', model: 'Vision M/L Gris', name: 'Black Diamond Vision M/L Gris', description: 'Casco ligero para escalada', metadata: { tipo: 'Casco', talla: 'M/L' }, quantity: 4 },
    { category: 'Varios', brand: 'Petzl', model: 'Grigri', name: 'Petzl Grigri', description: 'Asegurador con frenado asistido', metadata: { tipo: 'Descensor', talla: 'N/A' }, quantity: 4 },
    { category: 'Varios', brand: 'Petzl', model: 'Stop', name: 'Petzl Stop', description: 'Descensor autobloqueante', metadata: { tipo: 'Descensor', talla: 'N/A' }, quantity: 6 },
    { category: 'Varios', brand: 'Petzl', model: 'Ascension', name: 'Petzl Ascension', description: 'Bloqueador para ascenso', metadata: { tipo: 'Bloqueador', talla: 'N/A' }, quantity: 8 },
]

// ============================================
// FUNCIÓN PRINCIPAL: APLICAR TEMPLATE
// ============================================

export async function applyClimbingClubTemplate(
    prisma: Pick<PrismaClient, 'organization' | 'category' | 'categoryChecklistTemplate' | 'product' | 'item'>,
    organizationId: string
): Promise<void> {
    console.log('  → Creating categories...')
    
    // Obtener el slug de la organización para identificadores únicos
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { slug: true }
    })
    
    if (!organization) {
        throw new Error(`Organization ${organizationId} not found`)
    }
    
    const orgPrefix = organization.slug.substring(0, 3).toUpperCase()
    
    // Crear todas las categorías de una vez con createManyAndReturn
    const createdCategories = await prisma.category.createManyAndReturn({
        data: CATEGORIES.map(cat => ({
            organizationId,
            name: cat.name,
            description: cat.description,
            icon: cat.icon,
            requiresUniqueNumbering: true,
            canBeComposite: cat.canBeComposite || false,
            canBeSubdivided: cat.canBeSubdivided || false,
            metadataSchema: cat.metadataSchema,
        })),
    })
    
    // Crear mapa de categorías por nombre
    const categoryMap: Record<string, string> = {}
    createdCategories.forEach((cat: { id: string; name: string }) => {
        categoryMap[cat.name] = cat.id
    })
    
    console.log(`  → Created ${CATEGORIES.length} categories`)
    
    // Crear checklist templates en batch
    console.log('  → Creating checklist templates...')
    
    const checklistData = Object.entries(CHECKLIST_TEMPLATES)
        .map(([categoryName, template]) => {
            const categoryId = categoryMap[categoryName]
            if (!categoryId) return null
            
            return {
                categoryId,
                name: template.name,
                description: template.description,
                items: template.items,
                isActive: true,
            }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
    
    await prisma.categoryChecklistTemplate.createMany({
        data: checklistData,
    })
    
    console.log(`  → Created ${checklistData.length} checklist templates`)
    
    // Crear productos en batch
    console.log('  → Creating products and items...')
    
    const productsData = SAMPLE_PRODUCTS.map(productData => {
        const categoryId = categoryMap[productData.category]
        if (!categoryId) return null
        
        return {
            organizationId,
            categoryId,
            brand: productData.brand,
            model: productData.model,
            name: productData.name,
            description: productData.description,
            metadata: productData.metadata,
        }
    }).filter((item): item is NonNullable<typeof item> => item !== null)
    
    const createdProducts = await prisma.product.createManyAndReturn({
        data: productsData,
    })
    
    console.log(`  → Created ${createdProducts.length} products`)
    
    // Crear items en batch
    const itemsData: Array<{
        organizationId: string
        productId: string
        status: string
        identifier: string
        hasUniqueNumbering: boolean
        isComposite: boolean
        metadata: Prisma.JsonObject
    }> = []
    
    let itemCounter = 0
    
    for (let idx = 0; idx < SAMPLE_PRODUCTS.length; idx++) {
        const productData = SAMPLE_PRODUCTS[idx]
        const product = createdProducts[idx]
        
        if (!product) continue
        
        const categorySlug = productData.category.toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
        
        for (let i = 0; i < productData.quantity; i++) {
            itemCounter++
            const categoryPrefix = categorySlug.toUpperCase().substring(0, 3)
            const identifier = `${orgPrefix}-${categoryPrefix}-${String(itemCounter).padStart(4, '0')}`
            
            itemsData.push({
                organizationId,
                productId: product.id,
                status: 'available',
                identifier,
                hasUniqueNumbering: true,
                isComposite: false,
                metadata: productData.metadata,
            })
        }
    }
    
    await prisma.item.createMany({
        data: itemsData,
    })
    
    console.log(`  → Created ${itemsData.length} items`)
    console.log('  ✓ Climbing club template applied successfully')
}
