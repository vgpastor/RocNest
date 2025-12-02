// Funciones generadoras de datos random para seeds
import { faker } from '@faker-js/faker/locale/es'
import {
    ORGANIZATION_TYPES,
    ACTIVITY_TYPES,
    SPANISH_REGIONS,
    BRANDS,
    MODELS,
    RESERVATION_PURPOSES,
    ITEM_STATUSES,
    RESERVATION_STATUSES,
} from './constants'
import type { ItemStatus, ReservationStatus, UserRole } from './types'

// ============================================
// HELPERS
// ============================================

export const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
export const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min
export const randomFloat = (min: number, max: number, decimals: number = 2) => {
    const value = Math.random() * (max - min) + min
    return Number(value.toFixed(decimals))
}
export const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// ============================================
// ORGANIZATION
// ============================================

export function generateOrganizationName(): string {
    const type = randomChoice(ORGANIZATION_TYPES)
    const activity = randomChoice(ACTIVITY_TYPES)
    const region = randomChoice(SPANISH_REGIONS)
    return `${type} de ${activity} ${region}`
}

export function generateOrganizationSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export function generateOrganizationData() {
    const name = generateOrganizationName()
    return {
        name,
        slug: generateOrganizationSlug(name),
        description: faker.company.catchPhrase(),
        settings: {
            allowMultipleCategories: faker.datatype.boolean(),
            requireItemApproval: faker.datatype.boolean({ probability: 0.3 }),
            maxItemsPerReservation: randomInt(5, 20),
        },
    }
}

// ============================================
// USER
// ============================================

export function generateUserData(
    organizationId: string,
    role: UserRole,
    orgSlug?: string,
    userIndex?: number
) {
    let email: string
    let fullName: string

    if (orgSlug && userIndex) {
        // Generar email dummy predecible: user1@org1.com, user2@org1.com, etc.
        email = `user${userIndex}@${orgSlug}.com`
        fullName = `User ${userIndex} (${role})`
    } else {
        // Fallback a faker para casos donde no se pase orgSlug/userIndex
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        email = faker.internet.email({ firstName, lastName }).toLowerCase()
        fullName = `${firstName} ${lastName}`
    }

    return {
        email,
        fullName,
        organizationId,
        role,
    }
}

// ============================================
// CATEGORY
// ============================================

export function generateCategoryMetadataSchema(categorySlug: string): any {
    const schemas: Record<string, any> = {
        cuerdas: {
            fields: [
                { name: 'tipo', type: 'select', options: ['Dinámica', 'Semiestática', 'Estática'] },
                { name: 'longitud_m', type: 'number' },
                { name: 'diametro_mm', type: 'number' },
                { name: 'fecha_fabricacion', type: 'date' },
                { name: 'color', type: 'text' },
            ],
        },
        mosquetones: {
            fields: [
                { name: 'tipo', type: 'select', options: ['HMS', 'Asimétrico', 'Simétrico', 'Maillon'] },
                { name: 'material', type: 'select', options: ['Aluminio', 'Acero'] },
                { name: 'seguro', type: 'select', options: ['Rosca', 'Automático', 'Sin seguro'] },
                { name: 'resistencia_kn', type: 'number' },
            ],
        },
        cascos: {
            fields: [
                { name: 'talla', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'] },
                { name: 'color', type: 'text' },
                { name: 'con_frontal', type: 'boolean' },
            ],
        },
    }

    return schemas[categorySlug] || { fields: [] }
}

// ============================================
// ITEM
// ============================================

export function generateItemsForCategory(
    categorySlug: string,
    categoryId: string,
    organizationId: string,
    count: number,
    startIndex: number = 0
): any[] {
    const items: any[] = []
    const brands = BRANDS[categorySlug as keyof typeof BRANDS] || ['Generic']
    const models = MODELS[categorySlug as keyof typeof MODELS] || ['Standard']

    for (let i = 0; i < count; i++) {
        const brand = randomChoice(brands)
        const model = models.length > 0 ? randomChoice(models) : 'Model'
        const status = randomItemStatus()
        const identifier = `${categorySlug.toUpperCase().slice(0, 3)}-${String(startIndex + i + 1).padStart(3, '0')}`

        let itemData: any = {
            organizationId,
            categoryId,
            brand,
            model,
            status,
            identifier,
        }

        // Generar metadata específica por categoría
        switch (categorySlug) {
            case 'cuerdas':
                const length = randomChoice([40, 50, 60, 80, 100, 150, 200])
                const tipo = randomChoice(['Dinámica', 'Semiestática', 'Estática'])
                itemData.name = `Cuerda ${tipo} ${brand} ${length}m`
                itemData.description = `Cuerda ${tipo.toLowerCase()} de ${length}m`
                itemData.metadata = {
                    tipo,
                    longitud_m: length,
                    diametro_mm: randomFloat(8.5, 11, 1),
                    fecha_fabricacion: faker.date.past({ years: 5 }).toISOString().split('T')[0],
                    color: faker.color.human(),
                }
                break

            case 'mosquetones':
                const mosqTipo = randomChoice(['HMS', 'Asimétrico', 'Simétrico', 'Maillon'])
                itemData.name = `Mosquetón ${mosqTipo} ${brand}`
                itemData.description = `Mosquetón tipo ${mosqTipo}`
                itemData.metadata = {
                    tipo: mosqTipo,
                    material: randomChoice(['Aluminio', 'Acero']),
                    seguro: randomChoice(['Rosca', 'Automático', 'Sin seguro']),
                    resistencia_kn: randomInt(20, 35),
                }
                break

            case 'sacas':
                const capacidad = randomChoice([30, 45, 60, 80, 100])
                itemData.name = `Saca ${brand} ${capacidad}L`
                itemData.description = `Mochila de ${capacidad} litros`
                itemData.metadata = {
                    capacidad_litros: capacidad,
                    tipo: randomChoice(['Transporte', 'Cuerda', 'Material', 'Personal']),
                    impermeable: faker.datatype.boolean(),
                }
                break

            case 'cascos':
                const talla = randomChoice(['XS', 'S', 'M', 'L', 'XL'])
                itemData.name = `Casco ${brand} ${model} ${talla}`
                itemData.description = `Casco de protección talla ${talla}`
                itemData.metadata = {
                    talla,
                    color: faker.color.human(),
                    con_frontal: faker.datatype.boolean({ probability: 0.6 }),
                }
                break

            case 'arneses':
                const tallasArnés = randomChoice(['XS', 'S', 'M', 'L', 'XL'])
                itemData.name = `Arnés ${brand} ${model} ${tallasArnés}`
                itemData.description = `Arnés de escalada talla ${tallasArnés}`
                itemData.metadata = {
                    talla: tallasArnés,
                    tipo: randomChoice(['Deportivo', 'Alpino', 'Completo']),
                }
                break

            default:
                itemData.name = `${brand} ${model}`
                itemData.description = `Item de ${categorySlug}`
                itemData.metadata = {}
        }

        items.push(itemData)
    }

    return items
}

function randomItemStatus(): ItemStatus {
    const rand = Math.random()
    if (rand < 0.75) return 'available' // 75%
    if (rand < 0.90) return 'in_use' // 15%
    if (rand < 0.97) return 'maintenance' // 7%
    return 'retired' // 3%
}

// ============================================
// RESERVATION
// ============================================

export function generateReservationData(
    organizationId: string,
    userId: string,
    availableItems: any[]
): any {
    const startDate = randomReservationStartDate()
    const durationDays = randomInt(1, 14)
    const estimatedReturnDate = new Date(startDate)
    estimatedReturnDate.setDate(estimatedReturnDate.getDate() + durationDays)

    const status = randomReservationStatus(startDate, estimatedReturnDate)

    return {
        organizationId,
        responsibleUserId: userId,
        createdBy: userId, // El usuario responsable también es quien crea la reserva
        startDate,
        estimatedReturnDate,
        purpose: randomChoice(RESERVATION_PURPOSES),
        status,
        notes: faker.datatype.boolean({ probability: 0.3 })
            ? faker.lorem.sentence()
            : null,
    }
}

function randomReservationStartDate(): Date {
    const now = new Date()
    // 30% pasadas, 20% presente (±3 días), 50% futuras
    const rand = Math.random()

    if (rand < 0.3) {
        // Pasadas: hace 1-60 días
        const daysAgo = randomInt(1, 60)
        const date = new Date(now)
        date.setDate(date.getDate() - daysAgo)
        return date
    } else if (rand < 0.5) {
        // Presente: ±3 días
        const days = randomInt(-3, 3)
        const date = new Date(now)
        date.setDate(date.getDate() + days)
        return date
    } else {
        // Futuras: en 1-90 días
        const daysAhead = randomInt(1, 90)
        const date = new Date(now)
        date.setDate(date.getDate() + daysAhead)
        return date
    }
}

function randomReservationStatus(startDate: Date, endDate: Date): ReservationStatus {
    const now = new Date()

    // Si es pasada, más probabilidad de estar returned
    if (endDate < now) {
        const rand = Math.random()
        if (rand < 0.80) return 'returned' // 80%
        if (rand < 0.90) return 'delivered' // 10%
        return 'cancelled' // 10%
    }

    // Si es actual o futura
    if (startDate <= now && endDate >= now) {
        // En curso
        const rand = Math.random()
        if (rand < 0.70) return 'delivered' // 70%
        if (rand < 0.85) return 'approved' // 15%
        return 'pending' // 15%
    }

    // Futura
    const rand = Math.random()
    if (rand < 0.50) return 'approved' // 50%
    if (rand < 0.90) return 'pending' // 40%
    return 'cancelled' // 10%
}

// ============================================
// DISTRIBUTION
// ============================================

export function distributeCountAcrossOrgs(
    totalCount: number,
    orgCount: number
): number[] {
    const distribution: number[] = []
    let remaining = totalCount

    for (let i = 0; i < orgCount - 1; i++) {
        const min = Math.floor(remaining / (orgCount - i) * 0.7)
        const max = Math.floor(remaining / (orgCount - i) * 1.3)
        const count = randomInt(min, max)
        distribution.push(count)
        remaining -= count
    }

    distribution.push(remaining)
    return distribution
}
