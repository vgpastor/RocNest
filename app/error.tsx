'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
            <div className="text-center max-w-md px-6">
                <h1 className="text-6xl font-bold text-[var(--color-foreground)]">500</h1>
                <h2 className="mt-4 text-xl font-semibold text-[var(--color-foreground)]">
                    Algo salió mal
                </h2>
                <p className="mt-2 text-[var(--color-muted-foreground)]">
                    Ha ocurrido un error inesperado. Puedes intentar de nuevo o volver al inicio.
                </p>
                <div className="mt-6 flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 transition-opacity"
                    >
                        Intentar de nuevo
                    </button>
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-md border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}
