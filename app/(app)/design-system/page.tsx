'use client'

/**
 * RocNest Design System Showcase
 * Component demonstration and documentation page
 */

import React from 'react'

import {
    Logo,
    Badge,
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Input,
    Textarea,
    Checkbox,
    Radio,
    Select,
    StatusBadge,
    EquipmentCard,
    MetricCard,
    SearchBar,
    EmptyState
} from '@/components'

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] p-8">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <Logo size={64} />
                    </div>
                    <h1 className="text-5xl font-black text-gradient-primary">
                        RocNest Design System
                    </h1>
                    <p className="text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
                        Sistema de diseño completo para la gestión de material de montaña
                    </p>
                </div>

                {/* Color Palette */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Paleta de Colores</h2>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Colores Primarios</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)]" />
                                <p className="text-sm font-medium">Primary</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-border)]" />
                                <p className="text-sm font-medium">Primary Light</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[var(--color-primary-dark)] border border-[var(--color-border)]" />
                                <p className="text-sm font-medium">Primary Dark</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[var(--color-primary-subtle)] border border-[var(--color-border)]" />
                                <p className="text-sm font-medium">Primary Subtle</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-8">Colores Semánticos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[var(--color-success)] border border-[var(--color-border)]" />
                                <p className="text-sm font-medium">Success</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[var(--color-warning)] border border-[var(--color-border)]" />
                                <p className="text-sm font-medium">Warning</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[var(--color-destructive)] border border-[var(--color-border)]" />
                                <p className="text-sm font-medium">Error</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 rounded-lg bg-[var(--color-info)] border border-[var(--color-border)]" />
                                <p className="text-sm font-medium">Info</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Typography */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Tipografía</h2>
                    <div className="space-y-4">
                        <div className="text-5xl font-black">Heading 1 - Lexend Black</div>
                        <div className="text-4xl font-bold">Heading 2 - Lexend Bold</div>
                        <div className="text-3xl font-bold">Heading 3 - Lexend Bold</div>
                        <div className="text-2xl font-semibold">Heading 4 - Lexend Semibold</div>
                        <div className="text-xl font-medium">Heading 5 - Lexend Medium</div>
                        <div className="text-base">Body text - Lexend Regular</div>
                        <div className="text-sm text-[var(--color-muted-foreground)]">
                            Small text - Lexend Regular
                        </div>
                    </div>
                </section>

                {/* Badges */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Badges</h2>
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="error">Error</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge variant="reserved">Reserved</Badge>
                        <Badge variant="default">Default</Badge>
                    </div>

                    <h3 className="text-xl font-semibold mt-6">Status Badges</h3>
                    <div className="flex flex-wrap gap-3">
                        <StatusBadge status="available" />
                        <StatusBadge status="reserved" />
                        <StatusBadge status="pending" />
                        <StatusBadge status="confirmed" />
                        <StatusBadge status="active" />
                        <StatusBadge status="cancelled" />
                        <StatusBadge status="maintenance" />
                    </div>
                </section>

                {/* Buttons */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Buttons</h2>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary">Primary Button</Button>
                            <Button variant="secondary">Secondary Button</Button>
                            <Button variant="outline">Outline Button</Button>
                            <Button variant="ghost">Ghost Button</Button>
                            <Button variant="destructive">Destructive Button</Button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary" size="sm">Small</Button>
                            <Button variant="primary" size="md">Medium</Button>
                            <Button variant="primary" size="lg">Large</Button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary" disabled>Disabled</Button>
                            <Button variant="primary" isLoading>Loading</Button>
                        </div>
                    </div>
                </section>

                {/* Form Elements */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Form Elements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                        <Input label="Nombre" placeholder="Ingresa tu nombre" />
                        <Input label="Email" type="email" placeholder="tu@email.com" />
                        <Input label="Con error" error="Este campo es requerido" />
                        <SearchBar placeholder="Buscar material..." />

                        <div className="col-span-full">
                            <Textarea label="Descripción" placeholder="Escribe una descripción..." />
                        </div>

                        <Select
                            label="Categoría"
                            options={[
                                { value: '', label: 'Selecciona una categoría' },
                                { value: 'arneses', label: 'Arneses' },
                                { value: 'cuerdas', label: 'Cuerdas' },
                                { value: 'piolets', label: 'Piolets' },
                            ]}
                        />

                        <div className="space-y-3">
                            <p className="text-sm font-medium">Checkboxes</p>
                            <Checkbox label="Arneses" />
                            <Checkbox label="Cuerdas" />
                            <Checkbox label="Piolets" />
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium">Radio Buttons</p>
                            <Radio name="availability" label="Todos" />
                            <Radio name="availability" label="Disponible" />
                            <Radio name="availability" label="Reservado" />
                        </div>
                    </div>
                </section>

                {/* Cards */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Cards</h2>

                    <h3 className="text-xl font-semibold">Metric Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Material"
                            value="152"
                            change={{ value: 2, label: 'semana pasada' }}
                        />
                        <MetricCard
                            title="Material Disponible"
                            value="89"
                            change={{ value: -5, label: 'semana pasada' }}
                        />
                        <MetricCard
                            title="Reservas Activas"
                            value="14"
                            change={{ value: 10, label: 'semana pasada' }}
                        />
                        <MetricCard
                            title="Socios Activos"
                            value="245"
                            change={{ value: 1, label: 'mes pasado' }}
                        />
                    </div>

                    <h3 className="text-xl font-semibold mt-8">Equipment Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <EquipmentCard
                            id="1"
                            name="Arnés Petzl Corax"
                            description="Arnés polivalente y regulable"
                            status="available"
                            category="Arneses"
                            onViewDetails={(id) => console.log('View details:', id)}
                        />
                        <EquipmentCard
                            id="2"
                            name="Cuerda Beal Joker 9.1mm"
                            description="Cuerda simple, doble y gemela"
                            status="reserved"
                            category="Cuerdas"
                            onViewDetails={(id) => console.log('View details:', id)}
                        />
                        <EquipmentCard
                            id="3"
                            name="Piolet Petzl Quark"
                            description="Piolet técnico para alpinismo"
                            status="available"
                            category="Piolets"
                            onViewDetails={(id) => console.log('View details:', id)}
                        />
                    </div>

                    <h3 className="text-xl font-semibold mt-8">Basic Card</h3>
                    <Card className="max-w-md">
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>
                                This is a description of the card content. It provides context about what's inside.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                Card content goes here. You can put any content you want inside a card component.
                            </p>
                        </CardContent>
                        <CardFooter className="gap-3">
                            <Button variant="primary">Action</Button>
                            <Button variant="outline">Cancel</Button>
                        </CardFooter>
                    </Card>
                </section>

                {/* Empty State */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Empty State</h2>
                    <EmptyState
                        icon={
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                        }
                        title="Aún no tienes reservas"
                        description="¡Anímate a explorar la montaña! Busca el material que necesitas para tu próxima aventura."
                        action={<Button variant="primary">Reservar Material</Button>}
                    />
                </section>

                {/* Utilities */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Utilidades</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Text Gradient</h3>
                            <p className="text-4xl font-black text-gradient-primary">
                                RocNest Design System
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">Glass Effect</h3>
                            <div className="glass p-6 rounded-lg">
                                <p className="font-semibold">Glassmorphism Effect</p>
                                <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                                    Efecto de vidrio con backdrop blur
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">Card Hover Effect</h3>
                            <Card hover className="max-w-sm">
                                <p className="font-semibold">Hover sobre esta card</p>
                                <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                                    Se eleva suavemente al pasar el cursor
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <section className="text-center py-12 border-t border-[var(--color-border)]">
                    <Logo size={48} showText />
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-4">
                        RocNest Design System - Versión 1.0
                    </p>
                </section>
            </div>
        </div>
    )
}
