'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Card, CardContent } from '@/components'

interface ReviewsFiltersProps {
    statusLabels: Record<string, string>
    priorityLabels: Record<string, string>
    categories: Array<{ id: string; name: string }>
}

export default function ReviewsFilters({ 
    statusLabels, 
    priorityLabels, 
    categories 
}: ReviewsFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const statusFilter = searchParams.get('status') || ''
    const priorityFilter = searchParams.get('priority') || ''
    const categoryFilter = searchParams.get('category') || ''

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/catalog/reviews?${params.toString()}`)
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium mb-2 block">Estado</label>
                        <select
                            className="w-full px-3 py-2 rounded-md border bg-background"
                            value={statusFilter}
                            onChange={(e) => updateFilter('status', e.target.value)}
                        >
                            <option value="">Todos</option>
                            {Object.entries(statusLabels).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium mb-2 block">Prioridad</label>
                        <select
                            className="w-full px-3 py-2 rounded-md border bg-background"
                            value={priorityFilter}
                            onChange={(e) => updateFilter('priority', e.target.value)}
                        >
                            <option value="">Todas</option>
                            {Object.entries(priorityLabels).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium mb-2 block">Categoría</label>
                        <select
                            className="w-full px-3 py-2 rounded-md border bg-background"
                            value={categoryFilter}
                            onChange={(e) => updateFilter('category', e.target.value)}
                        >
                            <option value="">Todas</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
