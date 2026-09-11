import type { Locale } from '@/lib/i18n'

/**
 * Textos de la sección de blog.
 *
 * Viven aquí y no en los diccionarios generales porque solo los usa esta
 * sección, y así el diccionario compartido no crece con cada apartado nuevo.
 */
export const BLOG_COPY: Record<Locale, {
    indexTitle: string
    indexDescription: string
    indexHeading: string
    indexIntro: string
    empty: string
    readMore: string
    readingMinutes: string
    backToBlog: string
    publishedOn: string
    by: string
}> = {
    es: {
        indexTitle: 'Blog',
        indexDescription:
            'Gestión de material deportivo, revisiones de seguridad y organización de clubes. Guías prácticas para responsables de material.',
        indexHeading: 'Blog',
        indexIntro:
            'Guías prácticas sobre gestión de material, revisiones de seguridad y organización de clubes deportivos.',
        empty: 'Todavía no hay artículos publicados.',
        readMore: 'Leer',
        readingMinutes: 'min de lectura',
        backToBlog: 'Volver al blog',
        publishedOn: 'Publicado el',
        by: 'por',
    },
    en: {
        indexTitle: 'Blog',
        indexDescription:
            'Sports equipment management, safety inspections and club organisation. Practical guides for equipment managers.',
        indexHeading: 'Blog',
        indexIntro:
            'Practical guides on equipment management, safety inspections and running a sports club.',
        empty: 'No articles published yet.',
        readMore: 'Read',
        readingMinutes: 'min read',
        backToBlog: 'Back to the blog',
        publishedOn: 'Published on',
        by: 'by',
    },
}
