export default function ConfigurationLoading() {
    return (
        <div className="max-w-6xl mx-auto animate-pulse">
            <div className="mb-8">
                <div className="h-9 w-56 bg-muted rounded-lg mb-2" />
                <div className="h-5 w-80 bg-muted rounded-lg" />
            </div>

            <div className="flex gap-2 mb-8 border-b border-border pb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-9 w-28 bg-muted rounded-lg" />
                ))}
            </div>

            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-6 space-y-4">
                        <div className="h-6 w-1/3 bg-muted rounded" />
                        <div className="h-4 w-full bg-muted rounded" />
                        <div className="h-4 w-2/3 bg-muted rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}
