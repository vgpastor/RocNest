'use client'

import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { Card, CardContent, Combobox } from '@/components/ui'
import { useRouter, useSearchParams } from 'next/navigation'

interface Category {
    id: string
    name: string
    slug: string
}

interface CatalogFiltersProps {
    categories: Category[]
}

export default function CatalogFilters({ categories }: CatalogFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const initialQ = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''

    const [searchTerm, setSearchTerm] = useState(initialQ)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only search if term changed and (length >= 2 or empty)
            if (searchTerm !== initialQ && (searchTerm.length >= 2 || searchTerm.length === 0)) {
                const params = new URLSearchParams(searchParams.toString())
                if (searchTerm) {
                    params.set('q', searchTerm)
                } else {
                    params.delete('q')
                }
                // Reset page to 1 on new search
                params.delete('page')
                router.push(`/catalog?${params.toString()}`)
            }
        }, 500) // 500ms debounce

        return () => clearTimeout(timer)
    }, [searchTerm, searchParams, router, initialQ])

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        if (e.target.value) {
            params.set('category', e.target.value)
        } else {
            params.delete('category')
        }
        // Reset page to 1 on category change
        params.delete('page')
        router.push(`/catalog?${params.toString()}`)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Immediate search on enter
        const params = new URLSearchParams(searchParams.toString())
        if (searchTerm) {
            params.set('q', searchTerm)
        } else {
            params.delete('q')
        }
        params.delete('page')
        router.push(`/catalog?${params.toString()}`)
    }

    return (
        <Card>
            <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
                        <input
                            name="q"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre, código, marca..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent"
                        />
                    </div>
                    <div className="relative w-full sm:w-[200px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
                        <Combobox
                            value={category}
                            onChange={(value) => {
                                const params = new URLSearchParams(searchParams.toString())
                                if (value) {
                                    params.set('category', value)
                                } else {
                                    params.delete('category')
                                }
                                params.delete('page')
                                router.push(`/catalog?${params.toString()}`)
                            }}
                            options={[
                                { value: '', label: 'Todas las categorías' },
                                ...categories.map(cat => ({
                                    value: cat.slug,
                                    label: cat.name
                                }))
                            ]}
                            placeholder="Todas las categorías"
                            className="w-full"
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
