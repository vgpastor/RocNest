export default function CatalogLoading() {
    return (
        <div className="max-w-6xl mx-auto animate-pulse">
            <div className="mb-8">
                <div className="h-9 w-48 bg-muted rounded-lg mb-2" />
                <div className="h-5 w-96 bg-muted rounded-lg" />
            </div>

            <div className="flex gap-2 mb-6">
                <div className="h-10 w-32 bg-muted rounded-lg" />
                <div className="h-10 w-32 bg-muted rounded-lg" />
                <div className="h-10 w-32 bg-muted rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-6 space-y-3">
                        <div className="h-5 w-3/4 bg-muted rounded" />
                        <div className="h-4 w-1/2 bg-muted rounded" />
                        <div className="h-4 w-2/3 bg-muted rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}
