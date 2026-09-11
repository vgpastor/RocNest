import type { Locale } from '@/lib/i18n'

/**
 * Taxonomía del blog.
 *
 * Conjunto cerrado y deliberado: son los tres territorios que RocNest quiere
 * cubrir en profundidad, y la profundidad es lo que construye autoridad
 * temática. Añadir una categoría es una decisión editorial, no un efecto
 * secundario de escribir un artículo, así que una categoría desconocida en el
 * frontmatter rompe el build en lugar de crear una página huérfana.
 *
 * Los slugs van en inglés en ambos idiomas, como el resto de rutas del sitio
 * (`/es/legal/privacy`, `/es/blog/category/safety`). Lo que se traduce es el
 * nombre visible, no la URL.
 */

export const CATEGORY_SLUGS = ['management', 'safety', 'technology'] as const
export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

type CategoryCopy = { name: string; description: string }

const CATEGORIES: Record<CategorySlug, Record<Locale, CategoryCopy>> = {
    management: {
        es: {
            name: 'Gestión de clubes',
            description:
                'Inventario, reservas, préstamos y organización del día a día de un club deportivo.',
        },
        en: {
            name: 'Club management',
            description:
                'Inventory, bookings, loans and the day-to-day running of a sports club.',
        },
    },
    safety: {
        es: {
            name: 'Seguridad y material',
            description:
                'Revisiones, vida útil, normativa y criterios de retirada del material deportivo.',
        },
        en: {
            name: 'Safety and equipment',
            description:
                'Inspections, service life, regulations and retirement criteria for sports equipment.',
        },
    },
    technology: {
        es: {
            name: 'Tecnología aplicada',
            description:
                'NFC, trazabilidad, digitalización y herramientas que resuelven problemas reales de un club.',
        },
        en: {
            name: 'Applied technology',
            description:
                'NFC, traceability, digitisation and tools that solve real problems for a club.',
        },
    },
}

export function isValidCategory(value: unknown): value is CategorySlug {
    return typeof value === 'string' && (CATEGORY_SLUGS as readonly string[]).includes(value)
}

export function getCategoryCopy(slug: CategorySlug, locale: Locale): CategoryCopy {
    return CATEGORIES[slug][locale] ?? CATEGORIES[slug].es
}

export function categoryPath(slug: CategorySlug, locale: Locale): string {
    return `/${locale}/blog/category/${slug}`
}
