import { ClipboardCheck, AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import {
    PageHeader,
    Card,
    CardContent,
    Button,
    Badge,
    EmptyState
} from '@/components'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

import ReviewsFilters from './ReviewsFilters'

interface ReviewsPageProps {
    searchParams: Promise<{
        status?: string
        priority?: string
        category?: string
    }>
}

const statusConfig = {
    pending: { label: 'Pendiente', icon: Clock, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    in_progress: { label: 'En Progreso', icon: AlertCircle, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    approved: { label: 'Aprobado', icon: CheckCircle, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    rejected: { label: 'Rechazado', icon: AlertTriangle, color: 'bg-red-500/10 text-red-500 border-red-500/20' },
    needs_attention: { label: 'Requiere Atención', icon: AlertCircle, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
}

const priorityConfig = {
    low: { label: 'Baja', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
    normal: { label: 'Normal', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    high: { label: 'Alta', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    urgent: { label: 'Urgente', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
    // Authentication is handled by middleware
    const sessionUser = await getSessionUser()

    // Get current organization
    const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId)

    if (!organizationId) {
        redirect('/organizations/select')
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

    if (!isAdmin) {
        redirect('/catalog')
    }

    const params = await searchParams
    const statusFilter = params.status
    const priorityFilter = params.priority
    const categoryFilter = params.category

    // Fetch reviews
    const reviews = await prisma.itemReview.findMany({
        where: {
            item: {
                organizationId,
                deletedAt: null,
            },
            ...(statusFilter && { status: statusFilter }),
            ...(priorityFilter && { priority: priorityFilter }),
            ...(categoryFilter && {
                item: {
                    product: {
                        categoryId: categoryFilter,
                    },
                },
            }),
        },
        include: {
            item: {
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
            reviewer: {
                select: {
                    fullName: true,
                    email: true,
                },
            },
            checkItems: true,
        },
        orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' },
        ],
    })

    // Fetch categories for filter
    const categories = await prisma.category.findMany({
        where: {
            organizationId,
            deletedAt: null,
        },
        orderBy: {
            name: 'asc',
        },
    })

    // Stats
    const stats = {
        pending: reviews.filter(r => r.status === 'pending').length,
        inProgress: reviews.filter(r => r.status === 'in_progress').length,
        needsAttention: reviews.filter(r => r.status === 'needs_attention').length,
        total: reviews.length,
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Revisión de Material"
                description="Gestiona y revisa el material que requiere atención"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pendientes</p>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">En Progreso</p>
                                <p className="text-2xl font-bold">{stats.inProgress}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Requieren Atención</p>
                                <p className="text-2xl font-bold">{stats.needsAttention}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <ClipboardCheck className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <ReviewsFilters
                statusLabels={Object.fromEntries(
                    Object.entries(statusConfig).map(([key, config]) => [key, config.label])
                )}
                priorityLabels={Object.fromEntries(
                    Object.entries(priorityConfig).map(([key, config]) => [key, config.label])
                )}
                categories={categories}
            />

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <EmptyState
                    icon={<ClipboardCheck className="h-8 w-8" />}
                    title="No hay revisiones"
                    description="No se encontraron revisiones con los filtros seleccionados"
                />
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const StatusIcon = statusConfig[review.status as keyof typeof statusConfig]?.icon || Clock
                        const statusStyle = statusConfig[review.status as keyof typeof statusConfig]?.color || ''
                        const priorityStyle = priorityConfig[review.priority as keyof typeof priorityConfig]?.color || ''

                        const completedChecks = review.checkItems.filter(item => item.checked).length
                        const totalChecks = review.checkItems.length

                        return (
                            <Card key={review.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold text-lg">
                                                            {review.item.product.name}
                                                        </h3>
                                                        {review.item.identifier && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                #{review.item.identifier}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {review.item.product.category && (
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Categoría: {review.item.product.category.name}
                                                        </p>
                                                    )}

                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <Badge className={`${statusStyle} border`}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusConfig[review.status as keyof typeof statusConfig]?.label || review.status}
                                                        </Badge>
                                                        <Badge className={`${priorityStyle} border`}>
                                                            Prioridad: {priorityConfig[review.priority as keyof typeof priorityConfig]?.label || review.priority}
                                                        </Badge>
                                                    </div>

                                                    {totalChecks > 0 && (
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <div className="flex-1 bg-secondary rounded-full h-2">
                                                                <div
                                                                    className="bg-primary h-2 rounded-full transition-all"
                                                                    style={{ width: `${(completedChecks / totalChecks) * 100}%` }}
                                                                />
                                                            </div>
                                                            <span>{completedChecks}/{totalChecks} completado</span>
                                                        </div>
                                                    )}

                                                    {review.notes && (
                                                        <p className="text-sm text-muted-foreground mt-2">
                                                            {review.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <Link href={`/catalog/reviews/${review.id}`}>
                                                <Button size="sm">
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(review.createdAt).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
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
