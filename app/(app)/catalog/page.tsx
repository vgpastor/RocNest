import { Package, Users, ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
import { ItemStatusLabels } from './domain/value-objects/ItemStatus'
import CatalogFilters from './CatalogFilters'
import { prisma } from '@/lib/prisma'
import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { getSessionUser } from '@/lib/auth/session'
import { PageHeader, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, EmptyState } from '@/components'
import ProductDetailsDialog from './components/ProductDetailsDialog'
import Pagination from '@/components/ui/pagination'

export default async function CatalogoPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; page?: string }>
}) {
    const { q, category, page } = await searchParams
    const currentPage = Number(page) || 1
    const ITEMS_PER_PAGE = 12

    // Authentication is handled by middleware
    const sessionUser = await getSessionUser()

    // Get current organization
    const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId)

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

    // Build Prisma query for products
    const whereClause: any = {
        organizationId,
        deletedAt: null
    }

    // Search filter
    if (q) {
        whereClause.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { brand: { contains: q, mode: 'insensitive' } },
            { model: { contains: q, mode: 'insensitive' } }
        ]
    }

    // Category filter
    if (category && category !== 'Todos') {
        const cat = categoriesList.find(c => c.name === category)
        if (cat) {
            whereClause.categoryId = cat.id
        }
    }

    // Get total count for pagination
    const totalProducts = await prisma.product.count({
        where: whereClause
    })
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

    // Fetch products with Prisma
    const products = await prisma.product.findMany({
        where: whereClause,
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        include: {
            category: {
                select: {
                    name: true,
                    icon: true
                }
            },
            _count: {
                select: { items: true }
            }
        },
        orderBy: {
            name: 'asc'
        }
    })

    return (
        <div className="space-y-6">
            <PageHeader
                title="Catálogo de Material"
                description="Gestiona el inventario de material de montaña"
                action={
                    isAdmin && (
                        <div className="flex gap-2">
                            <Link href="/catalog/reviews">
                                <Button variant="outline">
                                    <ClipboardCheck className="h-4 w-4 mr-2" />
                                    Revisiones
                                </Button>
                            </Link>
                            <Link href="/catalog/configuration/checklists">
                                <Button variant="outline">Checklists</Button>
                            </Link>
                            <Link href="/catalog/new">
                                <Button variant="primary">Añadir Material</Button>
                            </Link>
                        </div>
                    )
                }
            />

            {/* Filters */}
            <CatalogFilters categories={categoriesList} />

            {/* Items Grid */}
            {!products || products.length === 0 ? (
                <EmptyState
                    icon={<Package className="h-8 w-8" />}
                    title="No se encontraron productos"
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
                    {products.map((product) => (
                        <ProductDetailsDialog key={product.id} product={product} isAdmin={isAdmin}>
                            <Card hover className="overflow-hidden cursor-pointer group h-full flex flex-col">
                                <div className="aspect-video w-full bg-[var(--color-muted)] relative overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[var(--color-muted-foreground)]">
                                            <Package className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm">
                                            x{product._count.items}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <CardTitle className="line-clamp-1">
                                                {product.name}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-1 mt-1">
                                                {product.brand} {product.model}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-end">
                                    <div className="space-y-3">
                                        {product.category && (
                                            <div className="flex items-center text-sm text-[var(--color-muted-foreground)]">
                                                <span className="font-medium text-[var(--color-foreground)] mr-2">Categoría:</span>
                                                {product.category.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-end">
                                        <div className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                                            Ver inventario
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ProductDetailsDialog>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} />

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
