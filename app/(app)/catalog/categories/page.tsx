import { PrismaCategoryRepository } from '../infrastructure/repositories/PrismaCategoryRepository'
import { OrganizationContextService } from '@/app/application/services/OrganizationContextService'
import { getSessionUser } from '@/lib/auth/session'
import { PageHeader, Card, Button, Badge, EmptyState } from '@/components'
import CategoryDialog from './components/CategoryDialog'
import DeleteCategoryDialog from './components/DeleteCategoryDialog'
import { Edit, Trash2, Layers, Hash, Box, Split } from 'lucide-react'

export default async function CategoriesPage() {
    const sessionUser = await getSessionUser()
    const organizationId = await OrganizationContextService.getCurrentOrganizationId(sessionUser?.userId)

    if (!organizationId) {
        return <div>Organización no encontrada</div>
    }

    const categoryRepository = new PrismaCategoryRepository()
    const categories = await categoryRepository.findAll(organizationId)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Categorías"
                description="Gestiona las categorías de tus productos"
                action={
                    <CategoryDialog>
                        <Button>Nueva Categoría</Button>
                    </CategoryDialog>
                }
            />

            {categories.length === 0 ? (
                <EmptyState
                    title="No hay categorías"
                    description="Comienza creando tu primera categoría para organizar tus productos."
                    action={
                        <CategoryDialog>
                            <Button>Crear Categoría</Button>
                        </CategoryDialog>
                    }
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Card key={category.id} className="flex flex-col justify-between p-6 hover:border-[var(--color-primary)]/50 transition-colors group">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                            {/* We could dynamically render the icon here if we had a map, for now generic icon */}
                                            <Layers className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg leading-none">{category.name}</h3>
                                        </div>
                                    </div>
                                    <CategoryDialog category={category}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </CategoryDialog>
                                </div>

                                <p className="text-sm text-[var(--color-muted-foreground)] mb-4 line-clamp-2">
                                    {category.description || 'Sin descripción'}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {category.requiresUniqueNumbering && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Hash className="h-3 w-3" /> Numeración
                                        </Badge>
                                    )}
                                    {category.canBeComposite && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Box className="h-3 w-3" /> Kits
                                        </Badge>
                                    )}
                                    {category.canBeSubdivided && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Split className="h-3 w-3" /> Subdivisible
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center text-xs text-[var(--color-muted-foreground)]">
                                <span>Actualizado: {category.updatedAt.toLocaleDateString()}</span>
                                <DeleteCategoryDialog category={category}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-[var(--color-destructive)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </DeleteCategoryDialog>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
