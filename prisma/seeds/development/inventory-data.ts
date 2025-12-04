// Simplified inventory data for climbing/caving club
// Based on realistic product categories

export interface ProductTemplate {
    category: string
    brand: string
    model: string
    characteristics: string
    basePrice: number
    variants?: {
        size?: string[]
        length?: number[]
        diameter?: number[]
        color?: string[]
        material?: string[]
    }
}

// ============================================
// CATEGORÍAS Y PRODUCTOS
// ============================================

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
    // ============================================
    // 1. CUERDAS
    // ============================================
    {
        category: 'Cuerdas',
        brand: 'Petzl',
        model: 'Volta',
        characteristics: 'Cuerda dinámica para escalada deportiva',
        basePrice: 180,
        variants: {
            diameter: [9.2, 9.5],
            length: [40, 50, 60, 70, 80],
            color: ['Azul', 'Verde', 'Rojo']
        }
    },
    {
        category: 'Cuerdas',
        brand: 'Beal',
        model: 'Karma',
        characteristics: 'Cuerda dinámica versátil',
        basePrice: 160,
        variants: {
            diameter: [9.8, 10.2],
            length: [50, 60, 70, 80],
            color: ['Naranja', 'Azul', 'Verde']
        }
    },
    {
        category: 'Cuerdas',
        brand: 'Edelrid',
        model: 'Swift Protect',
        characteristics: 'Cuerda semiestática para progresión',
        basePrice: 200,
        variants: {
            diameter: [8.9, 9.5, 10.5],
            length: [30, 40, 50, 60, 80, 100],
            color: ['Negro', 'Rojo', 'Azul']
        }
    },
    {
        category: 'Cuerdas',
        brand: 'Fixe',
        model: 'Fanatic',
        characteristics: 'Cuerda semiestática para espeleología',
        basePrice: 190,
        variants: {
            diameter: [9, 10, 10.5],
            length: [50, 80, 100, 150, 200],
            color: ['Blanco/Negro', 'Rojo/Negro', 'Azul/Negro']
        }
    },
    {
        category: 'Cuerdas',
        brand: 'Tendon',
        model: 'Static',
        characteristics: 'Cuerda estática para trabajos verticales',
        basePrice: 220,
        variants: {
            diameter: [10, 11],
            length: [50, 100, 150, 200],
            color: ['Blanco', 'Negro']
        }
    },

    // ============================================
    // 2. MOSQUETONES
    // ============================================
    {
        category: 'Mosquetones',
        brand: 'Petzl',
        model: 'Attache',
        characteristics: 'Mosquetón HMS con seguro de rosca',
        basePrice: 12,
        variants: {
            material: ['Aluminio'],
        }
    },
    {
        category: 'Mosquetones',
        brand: 'Black Diamond',
        model: 'RockLock',
        characteristics: 'Mosquetón HMS screwgate',
        basePrice: 11,
        variants: {
            material: ['Aluminio'],
        }
    },
    {
        category: 'Mosquetones',
        brand: 'DMM',
        model: 'XSRE',
        characteristics: 'Mosquetón asimétrico ligero',
        basePrice: 9,
        variants: {
            material: ['Aluminio'],
        }
    },
    {
        category: 'Mosquetones',
        brand: 'Climbing Technology',
        model: 'Concept SGL',
        characteristics: 'Mosquetón automático',
        basePrice: 15,
        variants: {
            material: ['Aluminio'],
        }
    },
    {
        category: 'Mosquetones',
        brand: 'Kong',
        model: 'Ovalone',
        characteristics: 'Mosquetón ovalado simétrico',
        basePrice: 10,
        variants: {
            material: ['Aluminio', 'Acero'],
        }
    },
    {
        category: 'Mosquetones',
        brand: 'Petzl',
        model: 'Oxan',
        characteristics: 'Maillon acero alta resistencia',
        basePrice: 8,
        variants: {
            material: ['Acero'],
        }
    },

    // ============================================
    // 3. SACAS
    // ============================================
    {
        category: 'Sacas',
        brand: 'Petzl',
        model: 'Bucket',
        characteristics: 'Saca de transporte resistente',
        basePrice: 50,
        variants: {
            size: ['25L', '35L', '45L'],
            color: ['Amarillo', 'Rojo', 'Negro']
        }
    },
    {
        category: 'Sacas',
        brand: 'Beal',
        model: 'Combi',
        characteristics: 'Mochila-saca convertible',
        basePrice: 70,
        variants: {
            size: ['45L', '60L'],
            color: ['Azul', 'Negro', 'Rojo']
        }
    },
    {
        category: 'Sacas',
        brand: 'Rodcle',
        model: 'Pit Rope Bag',
        characteristics: 'Saca específica para cuerdas',
        basePrice: 45,
        variants: {
            size: ['45L', '60L', '80L'],
            color: ['Verde', 'Rojo', 'Azul']
        }
    },
    {
        category: 'Sacas',
        brand: 'Singing Rock',
        model: 'Rope Bag',
        characteristics: 'Saca de cuerda con lona',
        basePrice: 55,
        variants: {
            size: ['60L', '80L', '100L'],
            color: ['Negro', 'Verde']
        }
    },

    // ============================================
    // 4. CINTAS
    // ============================================
    {
        category: 'Cintas',
        brand: 'Petzl',
        model: 'Express',
        characteristics: 'Cinta express para reuniones',
        basePrice: 15,
        variants: {
            length: [60, 80, 120],
            material: ['Dyneema']
        }
    },
    {
        category: 'Cintas',
        brand: 'Edelrid',
        model: 'Aramid Cord',
        characteristics: 'Anillo de cordino resistente',
        basePrice: 12,
        variants: {
            length: [60, 120, 240],
            material: ['Aramida']
        }
    },
    {
        category: 'Cintas',
        brand: 'Fixe',
        model: 'Dyneema Sling',
        characteristics: 'Anillo ultraligero',
        basePrice: 10,
        variants: {
            length: [60, 120, 240],
            material: ['Dyneema']
        }
    },
    {
        category: 'Cintas',
        brand: 'DMM',
        model: 'Nylon Sling',
        characteristics: 'Anillo de poliamida clásico',
        basePrice: 8,
        variants: {
            length: [60, 120, 240],
            material: ['Poliamida']
        }
    },

    // ============================================
    // 5. ANCLAJES
    // ============================================
    {
        category: 'Anclajes',
        brand: 'Fixe',
        model: 'Spit 8mm',
        characteristics: 'Spit de expansión 8mm',
        basePrice: 1.5,
        variants: {
            material: ['Acero', 'Inox']
        }
    },
    {
        category: 'Anclajes',
        brand: 'Fixe',
        model: 'Spit 10mm',
        characteristics: 'Spit de expansión 10mm',
        basePrice: 2,
        variants: {
            material: ['Acero', 'Inox']
        }
    },
    {
        category: 'Anclajes',
        brand: 'Fixe',
        model: 'Parabolt 8x80',
        characteristics: 'Parabolt químico 8x80mm',
        basePrice: 1.8,
        variants: {
            material: ['Acero galvanizado', 'Inox A4']
        }
    },
    {
        category: 'Anclajes',
        brand: 'Fixe',
        model: 'Parabolt 10x100',
        characteristics: 'Parabolt químico 10x100mm',
        basePrice: 2.5,
        variants: {
            material: ['Acero galvanizado', 'Inox A4']
        }
    },
    {
        category: 'Anclajes',
        brand: 'Fixe',
        model: 'Parabolt 10x120',
        characteristics: 'Parabolt químico 10x120mm',
        basePrice: 3,
        variants: {
            material: ['Acero galvanizado', 'Inox A4']
        }
    },
    {
        category: 'Anclajes',
        brand: 'Fixe',
        model: 'Parabolt 12x140',
        characteristics: 'Parabolt químico 12x140mm para reuniones',
        basePrice: 4.5,
        variants: {
            material: ['Acero galvanizado', 'Inox A4']
        }
    },
    {
        category: 'Anclajes',
        brand: 'Petzl',
        model: 'Coeur Bolt',
        characteristics: 'Chapa fija anclaje',
        basePrice: 2.8,
        variants: {
            material: ['Acero Inox']
        }
    },
    {
        category: 'Anclajes',
        brand: 'Raumer',
        model: 'Steel Hanger',
        characteristics: 'Chapa acero alta resistencia',
        basePrice: 3.2,
        variants: {
            material: ['Acero Inox']
        }
    },

    // ============================================
    // 6. HERRAMIENTAS AUTOMÁTICAS
    // ============================================
    {
        category: 'Herramientas Automáticas',
        brand: 'Hilti',
        model: 'TE 7-A36',
        characteristics: 'Martillo perforador a batería',
        basePrice: 450,
    },
    {
        category: 'Herramientas Automáticas',
        brand: 'Bosch',
        model: 'GBH 18V-26',
        characteristics: 'Martillo perforador profesional',
        basePrice: 380,
    },
    {
        category: 'Herramientas Automáticas',
        brand: 'Makita',
        model: 'DHR263',
        characteristics: 'Rotomartillo inalámbrico',
        basePrice: 420,
    },
    {
        category: 'Herramientas Automáticas',
        brand: 'Hilti',
        model: 'Batería B36',
        characteristics: 'Batería litio 36V 6.0Ah',
        basePrice: 180,
    },
    {
        category: 'Herramientas Automáticas',
        brand: 'Bosch',
        model: 'Disco Diamante',
        characteristics: 'Disco de corte para roca',
        basePrice: 45,
    },
    {
        category: 'Herramientas Automáticas',
        brand: 'Xiaomi',
        model: 'Temp & Humidity',
        characteristics: 'Termómetro e higrómetro digital',
        basePrice: 15,
    },
    {
        category: 'Herramientas Automáticas',
        brand: 'Aranet',
        model: 'CO2 Monitor',
        characteristics: 'Medidor de CO2 para cuevas',
        basePrice: 250,
    },

    // ============================================
    // 7. VARIOS
    // ============================================
    {
        category: 'Varios',
        brand: 'Tatonka',
        model: 'First Aid Kit',
        characteristics: 'Botiquín completo primeros auxilios',
        basePrice: 80,
        variants: {
            size: ['Completo', 'Básico', 'Individual']
        }
    },
    {
        category: 'Varios',
        brand: 'Rodcle',
        model: 'Installation Bag',
        characteristics: 'Saca con compartimentos para instalación',
        basePrice: 65,
    },
    {
        category: 'Varios',
        brand: 'Petzl',
        model: 'Corax',
        characteristics: 'Arnés de escalada ajustable',
        basePrice: 65,
        variants: {
            size: ['XS', 'S', 'M', 'L', 'XL']
        }
    },
    {
        category: 'Varios',
        brand: 'Petzl',
        model: 'Boreo',
        characteristics: 'Casco de escalada y espeleología',
        basePrice: 55,
        variants: {
            size: ['S/M', 'M/L'],
            color: ['Blanco', 'Negro', 'Rojo', 'Azul']
        }
    },
    {
        category: 'Varios',
        brand: 'Black Diamond',
        model: 'Vision',
        characteristics: 'Casco ligero para escalada',
        basePrice: 75,
        variants: {
            size: ['S/M', 'M/L'],
            color: ['Gris', 'Verde', 'Negro']
        }
    },
    {
        category: 'Varios',
        brand: 'Petzl',
        model: 'Grigri',
        characteristics: 'Asegurador/descensor con frenado asistido',
        basePrice: 120,
    },
    {
        category: 'Varios',
        brand: 'Petzl',
        model: 'Stop',
        characteristics: 'Descensor autobloqueante',
        basePrice: 45,
    },
    {
        category: 'Varios',
        brand: 'Petzl',
        model: 'Ascension',
        characteristics: 'Bloqueador para ascenso',
        basePrice: 75,
    },
    {
        category: 'Varios',
        brand: 'Petzl',
        model: 'Basic',
        characteristics: 'Bloqueador ventral',
        basePrice: 40,
    },
]

// ============================================
// HELPERS
// ============================================

export function normalizeCategoryName(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export function expandProductTemplates(): Array<{
    category: string
    brand: string
    model: string
    fullName: string
    characteristics: string
    price: number
}> {
    const expandedProducts: Array<{
        category: string
        brand: string
        model: string
        fullName: string
        characteristics: string
        price: number
    }> = []

    for (const template of PRODUCT_TEMPLATES) {
        if (!template.variants) {
            // Sin variantes, agregar tal cual
            expandedProducts.push({
                category: template.category,
                brand: template.brand,
                model: template.model,
                fullName: `${template.brand} ${template.model}`,
                characteristics: template.characteristics,
                price: template.basePrice,
            })
            continue
        }

        // Con variantes, generar combinaciones
        const { size, length, diameter, color, material } = template.variants

        if (diameter && length) {
            // Cuerdas: combinación de diámetro y longitud
            for (const diam of diameter) {
                for (const len of length) {
                    for (const col of (color || [''])) {
                        const colorStr = col ? ` ${col}` : ''
                        expandedProducts.push({
                            category: template.category,
                            brand: template.brand,
                            model: template.model,
                            fullName: `${template.brand} ${template.model} ${diam}mm ${len}m${colorStr}`,
                            characteristics: `${template.characteristics} - ${diam}mm x ${len}m${colorStr}`,
                            price: template.basePrice * (len / 50), // Precio proporcional a longitud
                        })
                    }
                }
            }
        } else if (size && color) {
            // Sacas o productos con talla y color
            for (const s of size) {
                for (const c of color) {
                    expandedProducts.push({
                        category: template.category,
                        brand: template.brand,
                        model: template.model,
                        fullName: `${template.brand} ${template.model} ${s} ${c}`,
                        characteristics: `${template.characteristics} - ${s} - ${c}`,
                        price: template.basePrice,
                    })
                }
            }
        } else if (size) {
            // Solo tallas
            for (const s of size) {
                expandedProducts.push({
                    category: template.category,
                    brand: template.brand,
                    model: template.model,
                    fullName: `${template.brand} ${template.model} ${s}`,
                    characteristics: `${template.characteristics} - ${s}`,
                    price: template.basePrice,
                })
            }
        } else if (length && material) {
            // Cintas: longitud y material
            for (const len of length) {
                for (const mat of material) {
                    expandedProducts.push({
                        category: template.category,
                        brand: template.brand,
                        model: template.model,
                        fullName: `${template.brand} ${template.model} ${len}cm ${mat}`,
                        characteristics: `${template.characteristics} - ${len}cm ${mat}`,
                        price: template.basePrice * (len / 120),
                    })
                }
            }
        } else if (material) {
            // Solo material
            for (const mat of material) {
                expandedProducts.push({
                    category: template.category,
                    brand: template.brand,
                    model: template.model,
                    fullName: `${template.brand} ${template.model} ${mat}`,
                    characteristics: `${template.characteristics} - ${mat}`,
                    price: template.basePrice,
                })
            }
        }
    }

    return expandedProducts
}
