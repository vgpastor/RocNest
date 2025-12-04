import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth/session'
import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { PageHeader, Card, CardContent, CardHeader, CardTitle, Button, EmptyState } from '@/components'
import { ClipboardList, Plus } from 'lucide-react'
import Link from 'next/link'
import ChecklistTemplateList from './ChecklistTemplateList'

export default async function ChecklistTemplatesPage() {
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

    // Fetch categories with their checklist templates
    const categories = await prisma.category.findMany({
        where: {
            organizationId,
            deletedAt: null,
        },
        include: {
            checklistTemplates: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
        orderBy: {
            name: 'asc',
        },
    })

    return (
        <div className="space-y-6">
            <PageHeader
                title="Plantillas de Checklist"
                description="Gestiona las plantillas de verificación para cada categoría de material"
                action={
                    <Link href="/catalog/configuration/checklists/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Plantilla
                        </Button>
                    </Link>
                }
            />

            {categories.length === 0 ? (
                <EmptyState
                    icon={<ClipboardList className="h-8 w-8" />}
                    title="No hay categorías"
                    description="Primero debes crear categorías para poder asignarles plantillas de checklist"
                    action={
                        <Link href="/catalog/categories/new">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Crear Categoría
                            </Button>
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-6">
                    {categories.map((category) => (
                        <Card key={category.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {category.icon && <span>{category.icon}</span>}
                                            {category.name}
                                        </CardTitle>
                                        {category.description && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                    <Link href={`/catalog/configuration/checklists/new?categoryId=${category.id}`}>
                                        <Button size="sm" variant="outline">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Añadir Plantilla
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {category.checklistTemplates.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No hay plantillas de checklist para esta categoría
                                    </p>
                                ) : (
                                    <ChecklistTemplateList templates={category.checklistTemplates} />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
