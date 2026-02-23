import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
            <div className="text-center max-w-md px-6">
                <h1 className="text-6xl font-bold text-[var(--color-foreground)]">404</h1>
                <h2 className="mt-4 text-xl font-semibold text-[var(--color-foreground)]">
                    Página no encontrada
                </h2>
                <p className="mt-2 text-[var(--color-muted-foreground)]">
                    La página que buscas no existe o ha sido movida.
                </p>
                <div className="mt-6">
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 transition-opacity"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}
