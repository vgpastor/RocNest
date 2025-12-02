import { Package, Users } from 'lucide-react'
import Link from 'next/link'
import { ItemStatusLabels } from './domain/value-objects/ItemStatus'
import CatalogFilters from './CatalogFilters'
import { prisma } from '@/lib/prisma'
import { getCurrentOrganizationId } from '@/lib/organization-helpers'
import { getSessionUser } from '@/lib/auth/session'
import { PageHeader, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, EmptyState } from '@/components'

export default async function CatalogoPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>
}) {
    const { q, category } = await searchParams

    // Authentication is handled by middleware
    const sessionUser = await getSessionUser()

    // Get current organization
    const organizationId = await getCurrentOrganizationId()

    if (!organizationId) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <EmptyState
                    icon={<Users className="h-8 w-8" />}
                    title="Selecciona una organización"
                    description="Por favor selecciona una organización para ver el catálogo"
                />
            </div>
        )
    }

    // Check if user is admin
    let isAdmin = false
    if (sessionUser) {
        const userOrg = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: sessionUser.userId,
                    organizationId
                }
            }
        })
        isAdmin = userOrg?.role === 'admin' || userOrg?.role === 'owner'
    }

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
        <div className="space-y-6">
            <PageHeader
                title="Catálogo de Material"
                description="Gestiona el inventario de material de montaña"
                action={
                    isAdmin && (
                        <Link href="/catalog/new">
                            <Button variant="primary">Añadir Material</Button>
                        </Link>
                    )
                }
            />

            {/* Filters */}
            <CatalogFilters categories={categoriesList} />

            {/* Items Grid */}
            {!items || items.length === 0 ? (
                <EmptyState
                    icon={<Package className="h-8 w-8" />}
                    title="No se encontraron items"
                    description={
                        (q || category)
                            ? "Intenta ajustar los filtros de búsqueda"
                            : "Comienza agregando material al inventario"
                    }
                    action={
                        isAdmin && (
                            <Link href="/catalog/new">
                                <Button variant="primary">Añadir Material</Button>
                            </Link>
                        )
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => {
                        const statusInfo = ItemStatusLabels[item.status as keyof typeof ItemStatusLabels] || ItemStatusLabels.available

                        return (
                            <Card key={item.id} hover className="overflow-hidden">
                                <div className="aspect-video w-full bg-[var(--color-muted)] relative overflow-hidden">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[var(--color-muted-foreground)]">
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
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <CardTitle className="line-clamp-1">
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
                                            <div className="flex items-center text-sm text-[var(--color-muted-foreground)]">
                                                <span className="font-medium text-[var(--color-foreground)] mr-2">Categoría:</span>
                                                {item.category.name}
                                            </div>
                                        )}

                                        {/* Show key metadata if available */}
                                        {item.metadata && typeof item.metadata === 'object' && Object.keys(item.metadata).length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {Object.entries(item.metadata).slice(0, 3).map(([key, value]) => (
                                                    <Badge key={key} variant="secondary" size="sm" className="text-xs font-normal">
                                                        {key}: {String(value)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-end">
                                        <Link href={`/catalog/${item.id}`}>
                                            <Button variant="ghost" size="sm">
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

            {/* Floating Add Button for Mobile (Admin Only) */}
            {isAdmin && (
                <Link href="/catalog/new" className="lg:hidden">
                    <Button
                        variant="primary"
                        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex items-center justify-center"
                    >
                        +
                    </Button>
                </Link>
            )}
        </div>
    )
}
