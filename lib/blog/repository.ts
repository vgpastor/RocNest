import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

import type { Locale } from '@/lib/i18n'

import type { CategorySlug } from './category'
import {
    byNewestFirst,
    estimateReadingMinutes,
    isPublished,
    isValidSlug,
    parseFrontmatter,
    type Post,
    type PostSummary,
} from './post'

/**
 * Lectura de artículos desde `content/blog/<locale>/<slug>.md`.
 *
 * Solo servidor. Las páginas son estáticas, así que esto se ejecuta en build:
 * el coste de leer el disco no llega al visitante.
 */

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'blog')
const MARKDOWN_EXTENSION = '.md'

function isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
}

async function renderMarkdown(markdown: string): Promise<string> {
    const file = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(markdown)
    return String(file)
}

async function readPost(locale: Locale, slug: string): Promise<Post> {
    const source = `${locale}/${slug}${MARKDOWN_EXTENSION}`
    const raw = await readFile(path.join(CONTENT_ROOT, locale, `${slug}${MARKDOWN_EXTENSION}`), 'utf8')
    const { data, content } = matter(raw)
    const frontmatter = parseFrontmatter(data, source, slug)

    return {
        ...frontmatter,
        slug,
        locale,
        html: await renderMarkdown(content),
        readingMinutes: estimateReadingMinutes(content),
    }
}

async function listSlugs(locale: Locale): Promise<string[]> {
    let entries: string[]
    try {
        entries = await readdir(path.join(CONTENT_ROOT, locale))
    } catch {
        // Un idioma sin carpeta simplemente no tiene artículos todavía.
        return []
    }

    return entries
        .filter((name) => name.endsWith(MARKDOWN_EXTENSION))
        .map((name) => name.slice(0, -MARKDOWN_EXTENSION.length))
        .filter(isValidSlug)
}

/** Resúmenes publicados de un idioma, del más reciente al más antiguo. */
export async function getPostSummaries(locale: Locale): Promise<PostSummary[]> {
    const slugs = await listSlugs(locale)
    const posts = await Promise.all(slugs.map((slug) => readPost(locale, slug)))

    return posts
        .map(({ html: _html, ...summary }) => summary)
        .filter((post) => isPublished(post, isProduction()))
        .sort(byNewestFirst)
}

/** Resúmenes de una categoría, en el mismo orden que el listado general. */
export async function getPostSummariesByCategory(
    locale: Locale,
    category: CategorySlug,
): Promise<PostSummary[]> {
    const posts = await getPostSummaries(locale)
    return posts.filter((post) => post.category === category)
}

/** Un artículo concreto, o null si no existe o es borrador en producción. */
export async function getPost(locale: Locale, slug: string): Promise<Post | null> {
    if (!isValidSlug(slug)) return null

    try {
        const post = await readPost(locale, slug)
        return isPublished(post, isProduction()) ? post : null
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return null
        throw error
    }
}

/**
 * Traducciones publicadas de un artículo, por su translationKey.
 *
 * Devuelve el slug de cada idioma, que puede ser distinto del original: es lo
 * que permite declarar hreflang entre URLs con palabras diferentes.
 */
export async function getTranslations(
    translationKey: string,
    candidates: readonly Locale[],
): Promise<{ locale: Locale; slug: string }[]> {
    const found = await Promise.all(
        candidates.map(async (locale) => {
            const posts = await getPostSummaries(locale)
            const match = posts.find((post) => post.translationKey === translationKey)
            return match ? { locale, slug: match.slug } : null
        }),
    )
    return found.filter((entry): entry is { locale: Locale; slug: string } => entry !== null)
}
