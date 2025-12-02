# RocNest Design System - Quick Start Guide

## 🎨 What's Included

Tu design system completo está listo! Incluye:

- ✅ **Paleta de colores emerald green** tema montaña
- ✅ **Fuente Lexend** integrada
- ✅ **Componentes UI reutilizables** (Button, Badge, Card, Input, etc.)
- ✅ **Componentes específicos de RocNest** (Logo, StatusBadge, EquipmentCard, etc.)
- ✅ **Dark mode automático** con `light-dark()`
- ✅ **Logo PNG** integrado desde `/public/logo.png`

## 📂 Estructura de Archivos

```
RocNest/
├── app/
│   ├── globals.css              # Design tokens y CSS base
│   ├── layout.tsx               # Lexend font configurada
│   └── design-system/           # Página de demostración
│       └── page.tsx
├── components/
│   ├── index.ts                 # Exports centrales
│   ├── ui/
│   │   └── index.tsx            # Componentes UI primitivos
│   └── rocnest/
│       └── index.tsx            # Componentes RocNest específicos
├── lib/
│   └── utils.ts                 # Funciones utilidad (cn, formatDateRange, etc.)
└── public/
    └── logo.png                 # Tu logo (5MB)
```

## 🚀 Uso Rápido

### Import Components

```typescript
import {
  Button,
  Badge,
  Card,
  Input,
  Logo,
  StatusBadge,
  EquipmentCard,
  PageHeader
} from '@/components'
```

### Ejemplos de Uso

#### Button
```tsx
<Button variant="primary">Reservar Material</Button>
<Button variant="secondary">Ver Detalles</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="destructive">Eliminar</Button>
<Button isLoading>Cargando...</Button>
```

#### Logo
```tsx
<Logo size={32} showText />
{/* Usa automáticamente /public/logo.png */}
```

#### Status Badge
```tsx
<StatusBadge status="available" />   {/* Verde - Disponible */}
<StatusBadge status="pending" />     {/* Amarillo - Pendiente */}
<StatusBadge status="reserved" />    {/* Naranja - Reservado */}
```

#### Card
```tsx
<Card hover>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido aquí
  </Card Content>
  <CardFooter className="gap-3">
    <Button>Acción</Button>
  </CardFooter>
</Card>
```

#### Equipment Card (pre-built)
```tsx
<EquipmentCard
  id="123"
  name="Arnés Petzl Corax"
  description="Arnés polivalente y regulable"
  status="available"
  category="Arneses"
  imageUrl="/path/to/image.jpg"
  onViewDetails={(id) => console.log(id)}
/>
```

#### Form Elements
```tsx
<Input 
  label="Nombre" 
  placeholder="Ingresa tu nombre"
  error="Campo requerido" 
/>

<Textarea 
  label="Descripción" 
  placeholder="Escribe aquí..."
/>

<Select
  label="Categoría"
  options={[
    { value: 'arneses', label: 'Arneses' },
    { value: 'cuerdas', label: 'Cuerdas' }
  ]}
/>

<Checkbox label="Acepto términos" />
<Radio name="option" label="Opción 1" />
```

#### Search Bar
```tsx
<SearchBar 
  placeholder="Buscar material..."
  onSearch={(value) => console.log(value)}
/>
```

## 🎨 CSS Variables

Puedes usar estas variables CSS en cualquier lugar:

```css
/* Colores */
var(--color-primary)
var(--color-primary-light)
var(--color-primary-dark)
var(--color-primary-subtle)

var(--color-success)
var(--color-warning)
var(--color-destructive)
var(--color-info)

/* Backgrounds */
var(--color-background)
var(--color-card)
var(--color-muted)

/* Borders & Inputs */
var(--color-border)
var(--color-input)
var(--color-ring)

/* Radius */
var(--radius-sm)    /* 4px */
var(--radius-md)    /* 8px */
var(--radius-lg)    /* 12px */
var(--radius-xl)    /* 16px */
var(--radius-full)  /* Circular */

/* Transitions */
var(--transition-fast)  /* 150ms */
var(--transition-base)  /* 200ms */
var(--transition-slow)  /* 300ms */
```

## 🌗 Dark Mode

El dark mode está configurado automáticamente. Para cambiar entre modos:

```tsx
// En tu app
<html lang="es" className="light">  {/* o "dark" */}
```

Todos los componentes se adaptan automáticamente usando `light-dark()`.

## 🛠️ Utility Functions

```typescript
import { cn, formatDateRange, getStatusColor, truncate } from '@/components'

// Merge clases de Tailwind
const classes = cn('p-4', condition && 'bg-red-500')

// Formatear rango de fechas
const formatted = formatDateRange('2024-01-01', '2024-01-10')
// Output: "01/01/2024 - 10/01/2024"

// Obtener colores de status
const { badge, bg, text } = getStatusColor('available')

// Truncar texto
const short = truncate('Texto muy largo...', 50)
```

## 🎭 Utility Classes Especiales

```tsx
{/* Gradiente de texto */}
<h1 className="text-gradient-primary">RocNest</h1>

{/* Card con hover effect */}
<Card hover>...</Card>

{/* Glass morphism */}
<div className="glass p-6 rounded-lg">...</div>

{/* Custom scrollbar */}
<div className="scrollbar-thin overflow-y-auto">...</div>
```

## 📱 Ver Showcase

Visita `/design-system` en tu navegador para ver todos los componentes en acción:

```
http://localhost:3000/design-system
```

## 🎯 Next Steps

1. **Ver el showcase**: Navega a `/design-system` para ver todos los componentes
2. **Actualizar páginas existentes**: Usa los componentes en tus páginas
3. **Customizar colores**: Edita `app/globals.css` en la sección `@theme`
4. **Crear más componentes**: Extiende los componentes base según necesites

## 📊 Ejemplos Completos

### Página de Catálogo
```tsx
import { PageHeader, SearchBar, EquipmentCard, FilterSection, Checkbox } from '@/components'

export default function CatalogPage() {
  return (
    <div>
      <PageHeader 
        title="Catálogo de Material"
        description="Explora todo nuestro material disponible"
        action={<Button>Nueva Reserva</Button>}
      />
      
      <div className="flex gap-8">
        <aside className="w-1/4">
          <FilterSection title="Tipo de material" icon={<Icon />}>
            <Checkbox label="Arneses" />
            <Checkbox label="Cuerdas" />
            <Checkbox label="Piolets" />
          </FilterSection>
        </aside>
        
        <main className="flex-1">
          <SearchBar placeholder="Buscar material..." />
          <div className="grid grid-cols-3 gap-6 mt-6">
            <EquipmentCard {...itemData} />
          </div>
        </main>
      </div>
    </div>
  )
}
```

### Dashboard con Métricas
```tsx
import { MetricCard, Card } from '@/components'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-6">
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
    </div>
  )
}
```

## 🔧 Troubleshooting

### Logo no se ve:
- Verifica que `/public/logo.png` existe
- El archivo debe ser exactamente `logo.png` (minúsculas)
- Reinicia el servidor de desarrollo

### Colores no se aplican:
- Verifica que usas `bg-[var(--color-primary)]` con corchetes
- Asegúrate de que `globals.css` está importado en `layout.tsx`

### Components no importan:
- Usa el import desde `@/components` (no `@/components/ui`)
- Verifica que `tsconfig.json` tiene el path alias configurado

## 💡 Tip Pro

Para componentes específicos de tu dominio, créalos en `components/rocnest/` siguiendo el patrón existente:

```typescript
// components/rocnest/ReservationCard.tsx
import { Card, StatusBadge, Button } from '@/components/ui'

export const ReservationCard = ({ reservation }) => {
  return (
    <Card>
      {/* Tu componente aquí */}
    </Card>
  )
}
```

---

**¡Design System completo y listo para usar!** 🎉

Para cualquier duda, revisa:
- `/design-system` - Showcase completo
- `globals.css` - Todos los design tokens
- `components/index.ts` - Lista de exports disponibles
