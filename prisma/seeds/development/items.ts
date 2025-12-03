// Development seed - Items using real inventory data

import { PrismaClient } from '@prisma/client'
import { INVENTORY_DATA, normalizeCategoryName } from './inventory-data'
import type { SeedOrganization, SeedCategory, SeedItem } from '../shared/types'

export async function seedItems(
    prisma: PrismaClient,
    organizations: SeedOrganization[],
    categories: SeedCategory[]
): Promise<SeedItem[]> {
    const items: SeedItem[] = []

    console.log('   Using real inventory data...')

    // Group categories by organization and slug
    const categoriesByOrgAndSlug: Record<string, Record<string, SeedCategory>> = {}
    for (const category of categories) {
        if (!categoriesByOrgAndSlug[category.organizationId]) {
            categoriesByOrgAndSlug[category.organizationId] = {}
        }
        categoriesByOrgAndSlug[category.organizationId][category.slug] = category
    }

    // Global item counter to ensure unique identifiers across all organizations
    let globalItemCounter = 0

    // For each organization, create items from the inventory data
    for (const org of organizations) {
        const orgCategories = categoriesByOrgAndSlug[org.id] || {}

        for (const inventoryItem of INVENTORY_DATA) {
            const categorySlug = normalizeCategoryName(inventoryItem.category)
            const category = orgCategories[categorySlug]

            if (!category) {
                // Category doesn't exist for this org, skip
                continue
            }

            // Create Product first
            const productData = {
                organizationId: org.id,
                categoryId: category.id,
                brand: inventoryItem.brand,
                model: inventoryItem.model,
                name: `${inventoryItem.brand} ${inventoryItem.model}`,
                description: inventoryItem.characteristics,
                metadata: {
                    characteristics: inventoryItem.characteristics,
                    unit_price_eur: inventoryItem.unitPrice,
                },
            }

            // Check if product already exists (by name and category for now)
            let product = await prisma.product.findFirst({
                where: {
                    organizationId: org.id,
                    name: productData.name,
                    categoryId: category.id
                }
            })

            if (!product) {
                product = await prisma.product.create({ data: productData })
            }

            // Create each item based on quantity
            for (let i = 0; i < inventoryItem.quantity; i++) {
                globalItemCounter++
                const identifier = `${category.slug.toUpperCase().slice(0, 3)}-${String(globalItemCounter).padStart(4, '0')}`

                // Check if item already exists
                const existing = await prisma.item.findUnique({
                    where: { identifier },
                })

                if (existing) {
                    items.push(existing as unknown as SeedItem)
                    continue
                }

                // Determine status - most items available, some in use or maintenance
                let status = 'available'
                const rand = Math.random()
                if (rand < 0.15) status = 'in_use'
                else if (rand < 0.20) status = 'maintenance'

                // Create item data
                const itemData = {
                    organizationId: org.id,
                    productId: product.id,
                    status,
                    identifier,
                    metadata: {
                        item_number: globalItemCounter,
                        total_quantity: inventoryItem.quantity,
                    },
                }

                const item = await prisma.item.create({ data: itemData })
                items.push(item as unknown as SeedItem)
            }
        }
    }

    return items
}
