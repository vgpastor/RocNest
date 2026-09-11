import { locales, type Locale } from '@/lib/i18n'

import { isValidCategory, type CategorySlug } from './category'

/**
 * Dominio del blog.
 *
 * Puro: no toca el sistema de ficheros ni renderiza markdown. Eso vive en
 * `repository.ts`, que depende de este módulo y no al revés, de modo que las
 * reglas de qué es un artículo válido se pueden probar sin disco.
 */

export type PostFrontmatter = {
    title: string
    description: string
    /** ISO-8601, sin hora: la fecha de publicación es un día, no un instante. */
    date: string
    /** Autor visible. */
    author: string
    /** Territorio editorial al que pertenece. Ver `category.ts`. */
    category: CategorySlug
    /** Etiquetas para agrupar y para el JSON-LD. */
    tags: string[]
    /** Un artículo puede escribirse y no publicarse todavía. */
    draft: boolean
    /**
     * Une las versiones de un mismo artículo en distintos idiomas.
     *
     * Los slugs se traducen —"revision-material-escalada-club" frente a
     * "climbing-gear-inspection-club"— porque cada idioma quiere sus palabras
     * en la URL. Esta clave es lo que permite emitir hreflang entre ellos.
     * Si se omite, vale el propio slug.
     */
    translationKey: string
}

export type Post = PostFrontmatter & {
    slug: string
    locale: Locale
    /** HTML ya renderizado desde el markdown. */
    html: string
    /** Minutos estimados de lectura, redondeados hacia arriba, mínimo 1. */
    readingMinutes: number
}

export type PostSummary = Omit<Post, 'html'>

/** Slugs en minúsculas, sin acentos ni barras: forman parte de la URL. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidSlug(slug: string): boolean {
    return SLUG_PATTERN.test(slug)
}

/** Velocidad de lectura en castellano; sirve de aproximación para inglés. */
const WORDS_PER_MINUTE = 200

export function estimateReadingMinutes(markdown: string): number {
    const words = markdown.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export class InvalidPostError extends Error {
    constructor(source: string, reason: string) {
        super(`Artículo inválido en ${source}: ${reason}`)
        this.name = 'InvalidPostError'
    }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function requireString(value: unknown, field: string, source: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new InvalidPostError(source, `falta "${field}" o está vacío`)
    }
    return value.trim()
}

/**
 * Valida el frontmatter en bruto.
 *
 * Lanza en lugar de rellenar huecos: un artículo sin título o sin fecha es un
 * error del autor, y es mejor que reviente el build a que se publique una
 * página con metadatos inventados.
 */
export function parseFrontmatter(
    raw: Record<string, unknown>,
    source: string,
    fallbackTranslationKey: string,
): PostFrontmatter {
    const date = requireString(raw.date, 'date', source)
    if (!ISO_DATE.test(date)) {
        throw new InvalidPostError(source, `"date" debe ser AAAA-MM-DD, recibido "${date}"`)
    }
    // Date.parse("2026-02-31") no falla: desborda a marzo. La única forma fiable
    // de rechazar un día inexistente es comprobar que la fecha va y vuelve igual.
    const parsed = new Date(`${date}T00:00:00Z`)
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
        throw new InvalidPostError(source, `"date" no es una fecha real: "${date}"`)
    }

    const tags = raw.tags ?? []
    if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string')) {
        throw new InvalidPostError(source, '"tags" debe ser una lista de cadenas')
    }

    if (!isValidCategory(raw.category)) {
        throw new InvalidPostError(
            source,
            `"category" debe ser una de las categorías declaradas, recibido "${String(raw.category)}"`,
        )
    }

    const translationKey =
        typeof raw.translationKey === 'string' && raw.translationKey.trim().length > 0
            ? raw.translationKey.trim()
            : fallbackTranslationKey

    if (!isValidSlug(translationKey)) {
        throw new InvalidPostError(source, `"translationKey" no es válido: "${translationKey}"`)
    }

    return {
        title: requireString(raw.title, 'title', source),
        description: requireString(raw.description, 'description', source),
        date,
        author: requireString(raw.author, 'author', source),
        category: raw.category,
        tags: (tags as string[]).map((tag) => tag.trim()).filter(Boolean),
        draft: raw.draft === true,
        translationKey,
    }
}

/** Más recientes primero; a igualdad de fecha, alfabético por slug para que el orden sea estable. */
export function byNewestFirst(a: PostSummary, b: PostSummary): number {
    return b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)
}

/** En producción los borradores no existen; en desarrollo sí, para poder verlos. */
export function isPublished(post: PostSummary, isProduction: boolean): boolean {
    return !isProduction || !post.draft
}

export function isValidLocaleDirectory(name: string): name is Locale {
    return (locales as readonly string[]).includes(name)
}
