import { Search, Filter, Package, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, EmptyState } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ItemStatusLabels } from './domain/value-objects/ItemStatus'
import CatalogFilters from './CatalogFilters'

export default async function CatalogoPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>
}) {
    const supabase = await createClient()
    const { q, category } = await searchParams

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    // Fetch categories directly without repository
    const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    if (catError) {
        console.error('Error fetching categories:', catError)
    }

    const categoriesList = categoriesData || []

    // Build query
    let query = supabase
        .from('items')
        .select(`
            *,
            category:categories(name, slug, icon)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (q) {
        query = query.or(`name.ilike.%${q}%,identifier.ilike.%${q}%,brand.ilike.%${q}%,model.ilike.%${q}%`)
    }

    if (category && category !== 'Todos') {
        // Find category ID by slug or name
        const cat = categoriesList.find(c => c.slug === category || c.name === category)
        if (cat) {
            query = query.eq('category_id', cat.id)
        }
    }

    const { data: items, error } = await query

    if (error) {
        console.error('Error fetching items:', error)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Catálogo de Material</h1>
                    <p className="text-gray-500 mt-1">Gestiona el inventario de material de montaña</p>
                </div>
                {isAdmin && (
                    <Link href="/catalogo/nuevo">
                        <Button className="fixed bottom-6 right-6 h-14 w-auto px-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 z-50">
                            Add Item
                        </Button>
                    </Link>
                )}
            </div>

            {/* Filters */}
            <CatalogFilters categories={categoriesList} />

            {/* Items Grid */}
            {!items || items.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title="No se encontraron items"
                    description={q || category ? "Intenta ajustar los filtros de búsqueda" : "Comienza agregando material al inventario"}
                    action={isAdmin ? (
                        <Link href="/catalogo/nuevo">
                            <Button>
                                Add Item
                            </Button>
                        </Link>
                    ) : undefined}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => {
                        const statusInfo = ItemStatusLabels[item.status as keyof typeof ItemStatusLabels] || ItemStatusLabels.available

                        return (
                            <Card key={item.id} className="group hover:shadow-lg transition-all duration-200 border-gray-200/60">
                                <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <Badge variant={statusInfo.variant}>
                                            {statusInfo.label}
                                        </Badge>
                                    </div>
                                    {item.identifier && (
                                        <div className="absolute bottom-3 left-3">
                                            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm font-mono text-xs">
                                                {item.identifier}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
                                                {item.name}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-1 mt-1">
                                                {item.brand} {item.model}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {item.category && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="font-medium text-gray-700 mr-2">Categoría:</span>
                                                {item.category.name}
                                            </div>
                                        )}

                                        {/* Show key metadata if available */}
                                        {item.metadata && Object.keys(item.metadata).length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {Object.entries(item.metadata).slice(0, 3).map(([key, value]) => (
                                                    <Badge key={key} variant="outline" className="text-xs font-normal text-gray-600">
                                                        {key}: {String(value)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                        <Link href={`/catalogo/${item.id}`}>
                                            <Button variant="ghost" size="sm" className="text-sky-600 hover:text-sky-700 hover:bg-sky-50">
                                                Ver detalles
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
