import Link from 'next/link'

import { getCategoryCopy, categoryPath } from '@/lib/blog/category'
import type { PostSummary } from '@/lib/blog/post'
import type { Locale } from '@/lib/i18n'

import type { BlogCopy } from './copy'

/**
 * Listado de artículos.
 *
 * Lo comparten el índice del blog y las páginas de categoría, que muestran lo
 * mismo con distinta fuente de datos.
 */
export function PostList({
    posts,
    locale,
    copy,
    showCategory = true,
}: {
    posts: PostSummary[]
    locale: Locale
    copy: BlogCopy
    showCategory?: boolean
}) {
    if (posts.length === 0) {
        return <p className="mt-12 text-[var(--color-muted-foreground)]">{copy.empty}</p>
    }

    return (
        <ul className="mt-12 space-y-10">
            {posts.map((post) => (
                <li key={post.slug}>
                    <article>
                        {/* Sin fecha visible: el contenido es atemporal y la fecha de
                            publicación no le aporta nada al lector. La fecha real sigue
                            en el frontmatter, en el JSON-LD y en el RSS. */}
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                            {post.readingMinutes} {copy.readingMinutes}
                            {showCategory && (
                                <>
                                    {' · '}
                                    <Link
                                        href={categoryPath(post.category, locale)}
                                        className="font-medium text-[var(--color-primary)] hover:underline"
                                    >
                                        {getCategoryCopy(post.category, locale).name}
                                    </Link>
                                </>
                            )}
                        </p>
                        <h2 className="mt-1 text-xl font-bold">
                            <Link
                                href={`/${locale}/blog/${post.slug}`}
                                className="hover:text-[var(--color-primary)] transition-colors"
                            >
                                {post.title}
                            </Link>
                        </h2>
                        <p className="mt-2 leading-relaxed text-[var(--color-muted-foreground)]">
                            {post.description}
                        </p>
                        <Link
                            href={`/${locale}/blog/${post.slug}`}
                            className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline"
                        >
                            {copy.readMore} &rarr;
                        </Link>
                    </article>
                </li>
            ))}
        </ul>
    )
}
