'use client'

import { Search, Filter, Package, Plus, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent, Badge, Button, EmptyState } from '@/components/ui'

// Mock data
const mockItems = [
    {
        id: '1',
        name: 'Cuerda 70m',
        description: 'Cuerda dinámica 9.8mm, ideal para escalada deportiva',
        category: 'Escalada',
        status: 'available' as const,
        identifier: 'CRD-001',
    },
    {
        id: '2',
        name: 'Casco Petzl',
        description: 'Casco de escalada y alpinismo',
        category: 'Seguridad',
        status: 'available' as const,
        identifier: 'CSC-001',
    },
    {
        id: '3',
        name: 'Arnés BD',
        description: 'Arnés de escalada Black Diamond',
        category: 'Escalada',
        status: 'rented' as const,
        identifier: 'ARN-001',
    },
    {
        id: '4',
        name: 'Piolet Grivel',
        description: 'Piolet técnico para alpinismo',
        category: 'Alpinismo',
        status: 'maintenance' as const,
        identifier: 'PIO-001',
    },
    {
        id: '5',
        name: 'Tienda 3 personas',
        description: 'Tienda de campaña para 3 personas',
        category: 'Camping',
        status: 'available' as const,
        identifier: 'TND-001',
    },
]

const categories = ['Todos', 'Escalada', 'Alpinismo', 'Seguridad', 'Camping']

const statusLabels = {
    available: { label: 'Disponible', variant: 'success' as const },
    rented: { label: 'Alquilado', variant: 'warning' as const },
    maintenance: { label: 'Mantenimiento', variant: 'destructive' as const },
    lost: { label: 'Extraviado', variant: 'destructive' as const },
}

export default function AdminInventarioPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todos')
    const [selectedStatus, setSelectedStatus] = useState('all')

    const filteredItems = mockItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.identifier.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory
        const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
        return matchesSearch && matchesCategory && matchesStatus
    })

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Gestión de Inventario</h1>
                    <p className="text-muted-foreground">
                        Administra todo el material del grupo
                    </p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Añadir Material
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, descripción o código..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium">Categoría:</span>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Estado:</span>
                        {[
                            { key: 'all', label: 'Todos' },
                            { key: 'available', label: 'Disponibles' },
                            { key: 'rented', label: 'Alquilados' },
                            { key: 'maintenance', label: 'Mantenimiento' },
                        ].map((status) => (
                            <button
                                key={status.key}
                                onClick={() => setSelectedStatus(status.key)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedStatus === status.key
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Items Table */}
            {filteredItems.length > 0 ? (
                <div className="space-y-4 animate-fade-in">
                    {filteredItems.map((item) => (
                        <Card key={item.id} className="hover:shadow-md transition-all duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0">
                                            <Package className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <Badge variant={statusLabels[item.status].variant}>
                                                    {statusLabels[item.status].label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                                            <div className="flex gap-4 text-xs text-muted-foreground">
                                                <span>Código: {item.identifier}</span>
                                                <span>•</span>
                                                <span>Categoría: {item.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                            <Edit className="h-4 w-4" />
                                            Editar
                                        </Button>
                                        <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<Package className="h-8 w-8 text-muted-foreground" />}
                    title="No se encontraron resultados"
                    description="Intenta ajustar los filtros o la búsqueda"
                />
            )}
        </div>
    )
}
