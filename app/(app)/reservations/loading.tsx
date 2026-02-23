export default function ReservationsLoading() {
    return (
        <div className="max-w-6xl mx-auto animate-pulse">
            <div className="mb-8">
                <div className="h-9 w-44 bg-muted rounded-lg mb-2" />
                <div className="h-5 w-72 bg-muted rounded-lg" />
            </div>

            <div className="flex gap-2 mb-8 border-b border-border pb-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-9 w-28 bg-muted rounded-lg" />
                ))}
            </div>

            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-6 space-y-3">
                        <div className="flex justify-between">
                            <div className="h-5 w-40 bg-muted rounded" />
                            <div className="h-6 w-20 bg-muted rounded-full" />
                        </div>
                        <div className="h-4 w-56 bg-muted rounded" />
                        <div className="h-4 w-48 bg-muted rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}
