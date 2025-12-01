// Test seed - Datos mínimos y predecibles para tests

import { PrismaClient } from '@prisma/client'

export async function run(prisma: PrismaClient) {
    console.log('🧪 Creating minimal test data...\n')

    // 1. Organization
    const org = await prisma.organization.upsert({
        where: { slug: 'test-org' },
        update: {},
        create: {
            name: 'Test Organization',
            slug: 'test-org',
            description: 'Organization for automated testing',
            settings: {
                allowMultipleCategories: true,
                requireItemApproval: false,
                maxItemsPerReservation: 10,
            },
        },
    })

    console.log(`✅ Organization: ${org.name}`)

    // 2. Categories
    let catCuerdas = await prisma.category.findFirst({
        where: { organizationId: org.id, slug: 'test-cuerdas' },
    })
    if (!catCuerdas) {
        catCuerdas = await prisma.category.create({
            data: {
                organizationId: org.id,
                name: 'Test Cuerdas',
                slug: 'test-cuerdas',
                description: 'Cuerdas para testing',
                icon: '🪢',
                metadataSchema: {},
            },
        })
    }

    let catMosquetones = await prisma.category.findFirst({
        where: { organizationId: org.id, slug: 'test-mosquetones' },
    })
    if (!catMosquetones) {
        catMosquetones = await prisma.category.create({
            data: {
                organizationId: org.id,
                name: 'Test Mosquetones',
                slug: 'test-mosquetones',
                description: 'Mosquetones para testing',
                icon: '🔗',
                metadataSchema: {},
            },
        })
    }

    console.log(`✅ Categories: 2`)

    // 3. Items
    const existingItems = await prisma.item.count({
        where: { organizationId: org.id },
    })

    if (existingItems === 0) {
        // Cuerdas
        for (let i = 1; i <= 3; i++) {
            await prisma.item.create({
                data: {
                    organizationId: org.id,
                    categoryId: catCuerdas.id,
                    name: `Test Cuerda ${i}`,
                    description: `Cuerda de prueba número ${i}`,
                    brand: 'Test Brand',
                    model: 'Test Model',
                    status: 'available',
                    identifier: `TEST-CRD-${String(i).padStart(3, '0')}`,
                    metadata: { longitud_m: 50, tipo: 'Semiestática' },
                },
            })
        }

        // Mosquetones
        for (let i = 1; i <= 2; i++) {
            await prisma.item.create({
                data: {
                    organizationId: org.id,
                    categoryId: catMosquetones.id,
                    name: `Test Mosquetón ${i}`,
                    description: `Mosquetón de prueba número ${i}`,
                    brand: 'Test Brand',
                    model: 'Test Model',
                    status: 'available',
                    identifier: `TEST-MOS-${String(i).padStart(3, '0')}`,
                    metadata: { tipo: 'HMS' },
                },
            })
        }
    }

    const totalItems = await prisma.item.count({
        where: { organizationId: org.id },
    })

    console.log(`✅ Items: ${totalItems}`)

    console.log('\n📊 Test Data Summary:')
    console.log(`   • 1 Organization`)
    console.log(`   • 2 Categories`)
    console.log(`   • ${totalItems} Items`)
    console.log(`   • 0 Reservations (created by tests as needed)`)
}
