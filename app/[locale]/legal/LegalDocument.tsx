import type { ReactNode } from 'react'

import type { LegalSection } from './content'
import { CONTROLLER, isControllerComplete } from './identity'

/** Sustituye los marcadores {{...}} por la identidad del responsable. */
function fillPlaceholders(text: string): string {
    return text
        .replaceAll('{{controller}}', CONTROLLER.legalName)
        .replaceAll('{{taxId}}', CONTROLLER.taxId)
        .replaceAll('{{address}}', CONTROLLER.address)
        .replaceAll('{{privacyEmail}}', CONTROLLER.privacyEmail)
        .replaceAll('{{email}}', CONTROLLER.email)
}

export function LegalDocumentLayout({
    title,
    updated,
    updatedLabel,
    intro,
    sections,
    warning,
    children,
}: {
    title: string
    updated: string
    updatedLabel: string
    intro: string
    sections: readonly LegalSection[]
    warning: string
    children?: ReactNode
}) {
    return (
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                {updatedLabel} <time dateTime={updated}>{updated}</time>
            </p>

            {!isControllerComplete() && (
                <p
                    role="alert"
                    className="mt-6 rounded-lg border border-[var(--color-destructive)] bg-[var(--color-destructive-bg)] p-4 text-sm"
                >
                    {warning}
                </p>
            )}

            <p className="mt-6 text-base leading-relaxed text-[var(--color-muted-foreground)]">
                {intro}
            </p>

            {sections.map((section) => (
                <section key={section.heading} className="mt-10">
                    <h2 className="text-xl font-bold">{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="mt-3 leading-relaxed text-[var(--color-muted-foreground)]">
                            {fillPlaceholders(paragraph)}
                        </p>
                    ))}
                    {section.bullets && (
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            {section.bullets.map((bullet) => (
                                <li key={bullet} className="leading-relaxed text-[var(--color-muted-foreground)]">
                                    {fillPlaceholders(bullet)}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}

            {children}
        </article>
    )
}
