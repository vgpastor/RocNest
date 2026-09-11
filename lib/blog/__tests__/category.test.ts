import { describe, expect, it } from 'vitest'

import { CATEGORY_SLUGS, categoryPath, getCategoryCopy, isValidCategory } from '../category'

describe('isValidCategory', () => {
    it.each(CATEGORY_SLUGS)('acepta la categoría declarada %s', (slug) => {
        expect(isValidCategory(slug)).toBe(true)
    })

    // El conjunto es cerrado a propósito: añadir una categoría es una decisión
    // editorial, no algo que ocurra por escribir mal el frontmatter.
    it.each([['noticias'], ['Safety'], [''], [null], [undefined], [3], [{}]])(
        'rechaza %s',
        (value) => {
            expect(isValidCategory(value)).toBe(false)
        },
    )
})

describe('getCategoryCopy', () => {
    it('devuelve nombre y descripción en cada idioma', () => {
        for (const slug of CATEGORY_SLUGS) {
            for (const locale of ['es', 'en'] as const) {
                const copy = getCategoryCopy(slug, locale)
                expect(copy.name.length).toBeGreaterThan(0)
                expect(copy.description.length).toBeGreaterThan(0)
            }
        }
    })

    it('traduce de verdad: el castellano y el inglés no coinciden', () => {
        for (const slug of CATEGORY_SLUGS) {
            expect(getCategoryCopy(slug, 'es').name).not.toBe(getCategoryCopy(slug, 'en').name)
        }
    })
})

describe('categoryPath', () => {
    // El slug de la URL no se traduce, igual que el resto de rutas del sitio.
    it('mantiene el slug en inglés y cambia solo el idioma', () => {
        expect(categoryPath('safety', 'es')).toBe('/es/blog/category/safety')
        expect(categoryPath('safety', 'en')).toBe('/en/blog/category/safety')
    })
})
