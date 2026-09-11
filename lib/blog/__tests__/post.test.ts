import { describe, expect, it } from 'vitest'

import {
    InvalidPostError,
    byNewestFirst,
    estimateReadingMinutes,
    isPublished,
    isValidSlug,
    parseFrontmatter,
    type PostSummary,
} from '../post'

const SOURCE = 'es/ejemplo.md'

const valid = {
    title: 'Un título',
    description: 'Una descripción',
    date: '2026-09-11',
    author: 'Víctor',
    tags: ['seguridad', 'escalada'],
}

describe('isValidSlug', () => {
    it.each(['hola', 'hola-mundo', 'epi-2026', 'a1-b2-c3'])('acepta %s', (slug) => {
        expect(isValidSlug(slug)).toBe(true)
    })

    // Un slug es parte de la URL: nada de acentos, mayúsculas ni barras.
    it.each(['', 'Hola', 'con acento á', 'con/barra', '-empieza', 'termina-', 'doble--guion', '../escape'])(
        'rechaza %s',
        (slug) => {
            expect(isValidSlug(slug)).toBe(false)
        },
    )
})

describe('parseFrontmatter', () => {
    it('devuelve el frontmatter normalizado', () => {
        expect(parseFrontmatter({ ...valid }, SOURCE, 'ejemplo')).toEqual({
            ...valid,
            draft: false,
            translationKey: 'ejemplo',
        })
    })

    it('usa el slug como translationKey si no se indica otra', () => {
        expect(parseFrontmatter({ ...valid }, SOURCE, 'mi-slug').translationKey).toBe('mi-slug')
    })

    it('respeta la translationKey explícita, que es lo que une traducciones', () => {
        const post = parseFrontmatter({ ...valid, translationKey: 'gear-inspection' }, SOURCE, 'otro')
        expect(post.translationKey).toBe('gear-inspection')
    })

    it('marca el borrador solo con true explícito', () => {
        expect(parseFrontmatter({ ...valid, draft: 'sí' }, SOURCE, 's').draft).toBe(false)
        expect(parseFrontmatter({ ...valid, draft: true }, SOURCE, 's').draft).toBe(true)
    })

    it('recorta espacios y descarta etiquetas vacías', () => {
        const post = parseFrontmatter({ ...valid, title: '  Título  ', tags: ['  a  ', ''] }, SOURCE, 's')
        expect(post.title).toBe('Título')
        expect(post.tags).toEqual(['a'])
    })

    // Preferimos romper el build a publicar metadatos inventados.
    it.each([
        ['sin título', { ...valid, title: undefined }],
        ['título vacío', { ...valid, title: '   ' }],
        ['sin descripción', { ...valid, description: undefined }],
        ['sin autor', { ...valid, author: undefined }],
        ['sin fecha', { ...valid, date: undefined }],
        ['fecha con formato raro', { ...valid, date: '11/09/2026' }],
        ['fecha inexistente', { ...valid, date: '2026-02-31' }],
        ['tags que no son lista', { ...valid, tags: 'seguridad' }],
        ['tags con no-cadenas', { ...valid, tags: ['ok', 3] }],
        ['translationKey inválida', { ...valid, translationKey: 'Con Mayúsculas' }],
    ])('lanza %s', (_caso, raw) => {
        expect(() => parseFrontmatter(raw as Record<string, unknown>, SOURCE, 's')).toThrow(InvalidPostError)
    })
})

describe('estimateReadingMinutes', () => {
    it('nunca baja de un minuto', () => {
        expect(estimateReadingMinutes('hola')).toBe(1)
        expect(estimateReadingMinutes('   ')).toBe(1)
    })

    it('redondea hacia arriba a 200 palabras por minuto', () => {
        expect(estimateReadingMinutes('palabra '.repeat(200))).toBe(1)
        expect(estimateReadingMinutes('palabra '.repeat(201))).toBe(2)
        expect(estimateReadingMinutes('palabra '.repeat(600))).toBe(3)
    })
})

describe('byNewestFirst', () => {
    const post = (slug: string, date: string) => ({ slug, date }) as PostSummary

    it('ordena del más reciente al más antiguo', () => {
        const ordered = [post('a', '2026-01-01'), post('b', '2026-09-01')].sort(byNewestFirst)
        expect(ordered.map((p) => p.slug)).toEqual(['b', 'a'])
    })

    it('desempata por slug para que el orden sea estable', () => {
        const ordered = [post('z', '2026-01-01'), post('a', '2026-01-01')].sort(byNewestFirst)
        expect(ordered.map((p) => p.slug)).toEqual(['a', 'z'])
    })
})

describe('isPublished', () => {
    const draft = { draft: true } as PostSummary
    const live = { draft: false } as PostSummary

    it('oculta borradores en producción', () => {
        expect(isPublished(draft, true)).toBe(false)
        expect(isPublished(live, true)).toBe(true)
    })

    it('los muestra fuera de producción, para poder revisarlos', () => {
        expect(isPublished(draft, false)).toBe(true)
    })
})
