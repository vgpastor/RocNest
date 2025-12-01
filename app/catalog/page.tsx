import { Search, Filter, Package, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ItemStatusLabels } from './domain/value-objects/ItemStatus'
import CatalogFilters from './CatalogFilters'
import { prisma } from '@/lib/prisma'
import { getCurrentOrganizationId } from '@/lib/organization-helpers'

export default async function CatalogoPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>
}) {
    const supabase = await createClient()
    const { q, category } = await searchParams

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Get current organization
    const organizationId = await getCurrentOrganizationId()

    if (!organizationId) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Selecciona una organización</h2>
                    <p className="text-muted-foreground">Por favor selecciona una organización para ver el catálogo</p>
                </div>
            </div>
        )
    }

    // Check if user is admin (using profile from Prisma)
    const profile = await prisma.profile.findUnique({
        where: { id: user.id }
    })
    const isAdmin = profile?.role === 'admin'

    // Fetch categories for this organization
    const categoriesList = await prisma.category.findMany({
        where: {
            organizationId
        },
        orderBy: {
            name: 'asc'
        }
    })

    // Build Prisma query for items
    const whereClause: any = {
        organizationId,
        deletedAt: null
    }

    // Search filter
    if (q) {
        whereClause.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { identifier: { contains: q, mode: 'insensitive' } },
            { brand: { contains: q, mode: 'insensitive' } },
            { model: { contains: q, mode: 'insensitive' } }
        ]
    }

    // Category filter
    if (category && category !== 'Todos') {
        const cat = categoriesList.find(c => c.slug === category || c.name === category)
        if (cat) {
            whereClause.categoryId = cat.id
        }
    }

    // Fetch items with Prisma
    const items = await prisma.item.findMany({
        where: whereClause,
        include: {
            category: {
                select: {
                    name: true,
                    slug: true,
                    icon: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Catálogo de Material</h1>
                    <p className="text-gray-500 mt-1">Gestiona el inventario de material de montaña</p>
                </div>
                {isAdmin && (
                    <Link href="/catalog/new">
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
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="rounded-2xl bg-gray-100 p-4 mb-4">
                        <Package className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No se encontraron items</h3>
                    {(q || category) ? (
                        <p className="text-sm text-gray-600 mb-4 max-w-sm">Intenta ajustar los filtros de búsqueda</p>
                    ) : (
                        <p className="text-sm text-gray-600 mb-4 max-w-sm">Comienza agregando material al inventario</p>
                    )}
                    {isAdmin && (
                        <Link href="/catalog/new">
                            <Button>
                                Add Item
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => {
                        const statusInfo = ItemStatusLabels[item.status as keyof typeof ItemStatusLabels] || ItemStatusLabels.available

                        return (
                            <Card key={item.id} className="group hover:shadow-lg transition-all duration-200 border-gray-200/60">
                                <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
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
                                        {item.metadata && typeof item.metadata === 'object' && Object.keys(item.metadata).length > 0 && (
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
                                        <Link href={`/catalog/${item.id}`}>
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
