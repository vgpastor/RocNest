'use client'

import { Search, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
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

    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        if (e.target.value) {
            params.set('category', e.target.value)
        } else {
            params.delete('category')
        }
        router.push(`/catalogo?${params.toString()}`)
    }

    return (
        <Card>
            <CardContent className="p-4">
                <form className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Buscar por nombre, código, marca..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative w-full sm:w-[200px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            value={category}
                            onChange={handleCategoryChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
