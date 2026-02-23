# Guía de Uso de Prisma

## 📋 Configuración Actual

- **Prisma Schema:** `prisma/schema.prisma` (esquema completo con multi-organización)
- **Seed Data:** `prisma/seed.ts` (2 organizaciones de prueba + datos de ejemplo)
- **Migraciones:** Todo en una sola migración inicial

## 🚀 Comandos Principales

### 1. Generar Cliente Prisma
```bash
npx prisma generate
# o automáticamente:
npm install
```

### 2. Aplicar Schema a la Base de Datos (Primera vez)

**Opción A: Con Migraciones (Recomendado para producción)**
```bash
npm run db:migrate
# Te pedirá nombre de la migración, usa: "initial_multi_org_schema"
```

**Opción B: Push directo (Desarrollo rápido)**
```bash
npm run db:push
# Aplica el schema sin crear archivos de migración
```

### 3. Poblar con Datos de Prueba
```bash
npm run db:seed
```

### 4. Resetear Base de Datos (⚠️ Borra todo)
```bash
npm run db:reset
# Elimina todo, aplica migraciones desde cero y ejecuta seed
```

### 5. Abrir Prisma Studio (UI Visual)
```bash
npm run db:studio
# Abre interfaz web en http://localhost:5555
```

## 📝 Workflow Recomendado (Primera Vez)

```bash
# 1. Generar cliente
npm install

# 2. Crear migración inicial
npm run db:migrate
# Nombre sugerido: "initial_multi_org_schema"

# 3. Poblar con datos de prueba
npm run db:seed

# 4. Ver los datos en Studio
npm run db:studio
```

## 🔄 Workflow para Cambios Futuros

```bash
# 1. Modificar prisma/schema.prisma

# 2. Crear nueva migración
npm run db:migrate
# Nombre descriptivo, ej: "add_user_preferences"

# 3. (Opcional) Actualizar seed si es necesario
npm run db:seed
```

## 📊 Datos de Seed Incluidos

El seed crea automáticamente:

### Organizaciones
- **Club de Montaña Test** (slug: `club-montaña-test`)
- **Escuela de Escalada Test** (slug: `escuela-escalada-test`)

### Para Club de Montaña:
- Categoría: Cuerdas Dinámicas
  - Item: Cuerda Petzl Volta 9.2mm (60m)
- Categoría: Mosquetones
  - Item: Mosquetón Petzl Attache HMS

### Para Escuela de Escalada:
- Categoría: Arneses
  - Item: Arnés Black Diamond Momentum

## ⚠️ Importante

1. **DATABASE_URL**: URL de conexión principal (puede usar connection pooling)
2. **DIRECT_URL**: Conexión directa sin pooling (puerto 5432) - necesaria para migraciones
3. El schema ya incluye toda la estructura multi-organización
4. La autorización se gestiona a nivel de aplicación (middleware JWT)

## 🔗 Usar Prisma en el Código

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Ejemplo: Obtener organizaciones
const orgs = await prisma.organization.findMany()

// Ejemplo: Crear item
const item = await prisma.item.create({
  data: {
    organizationId: 'org-id-here',
    categoryId: 'category-id-here',
    name: 'Nuevo item',
    status: 'available',
  }
})
```

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma + PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql)
