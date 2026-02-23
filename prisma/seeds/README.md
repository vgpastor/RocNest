# Prisma Seeds - RocNest

Sistema modular de seeding con soporte para entornos de desarrollo y testing.

## 🚀 Uso Rápido

```bash
# Development (datos abundantes)
npm run db:seed:dev

# Testing (datos mínimos)
npm run db:seed:test

# Development + limpiar datos previos
npm run db:seed:dev:clear

# Setup para tests (limpia + seed test)
npm run test:setup
```

## 📁 Estructura

```
prisma/
├── seed.ts                          # Archivo principal
├── seeds/
│   ├── development/                 # Seed de desarrollo
│   │   ├── index.ts
│   │   ├── organizations.ts
│   │   ├── users.ts
│   │   ├── categories.ts
│   │   ├── items.ts
│   │   └── reservations.ts
│   ├── test/                        # Seed de testing
│   │   ├── index.ts
│   │   └── minimal.ts
│   └── shared/                      # Código compartido
│       ├── factories.ts
│       ├── constants.ts
│       └── types.ts
```

## 📊 Datos Generados

### Development Seed

- **7 Organizaciones** con nombres variados
- **70-140 Usuarios** (10-20 por org)
  - 1 owner, 2-3 admins, resto members
- **56-84 Categorías** (8-12 por org)
  - Cuerdas, Mosquetones, Sacas, Cascos, Arneses, etc.
- **350-700 Items** (50-100 por org)
  - Con metadata variada y realista
  - Estados mezclados: 75% available, 15% in_use, 7% maintenance, 3% retired
- **70-210 Reservas** (10-30 por org)
  - Estados variados: pending, approved, delivered, returned, cancelled
  - Fechas pasadas, presentes y futuras

### Test Seed

- **1 Organización**: "Test Organization"
- **0 Usuarios** (se crean en tests según necesidad)
- **2 Categorías**: Test Cuerdas, Test Mosquetones
- **5 Items**: 3 cuerdas + 2 mosquetones
- **0 Reservas** (se crean en tests según necesidad)

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run db:seed` | Ejecuta seed (default: development) |
| `npm run db:seed:dev` | Seed de development |
| `npm run db:seed:test` | Seed de testing |
| `npm run db:seed:dev:clear` | Development + limpia datos |
| `npm run test:setup` | Test + limpia datos |

## 🎯 Argumentos CLI

```bash
# Especificar environment
npx prisma db seed -- --environment development
npx prisma db seed -- --environment test

# Limpiar datos antes de seed
npx prisma db seed -- --clear

# Combinado
npx prisma db seed -- --environment development --clear
```

## 💡 Casos de Uso

### Desarrollo Local
```bash
# Primera vez: seed completo
npm run db:seed:dev

# Resetear y volver a seed
npm run db:seed:dev:clear
```

### Testing
```bash
# Setup inicial para tests
npm run test:setup

# Los tests crean usuarios y reservas específicos según necesidad
```

### CI/CD
```bash
# En pipeline de tests
npm run test:setup
npm test
```

## 📝 Notas Importantes

### Usuarios Mock

Los usuarios de development se crean **sin contraseña real** para simplificar el seeding. Estos usuarios:

- ✅ Aparecen en la UI
- ✅ Pueden ser responsables de reservas
- ❌ NO pueden hacer login

Para usuarios reales que puedan hacer login, créalos desde la pagina de registro de la aplicacion (`/register`).

### Performance

- Development seed: ~30-60 segundos
- Test seed: ~2-5 segundos

### Idempotencia

Todos los seeds usan `upsert` o `findFirst + create`, por lo que son seguros de ejecutar múltiples veces sin duplicar datos (excepto items y reservas que siempre se crean nuevos).

## 🔄 Añadir Nuevos Seeds

### 1. Crear función generadora en `shared/factories.ts`

```typescript
export function generateNewEntityData() {
  return {
    // ... data generation logic
  }
}
```

### 2. Crear módulo de seed

```typescript
// prisma/seeds/development/new-entity.ts
export async function seedNewEntity(prisma: PrismaClient) {
  // ... seeding logic
}
```

### 3. Añadir al orquestador

```typescript
// prisma/seeds/development/index.ts
import { seedNewEntity } from './new-entity'

export async function run(prisma: PrismaClient) {
  // ...
  await seedNewEntity(prisma)
}
```

## 🐛 Troubleshooting

### Error: "DATABASE_URL not found"
Asegúrate de tener `.env.local` con las variables de entorno.

### Seed tarda mucho
Normal para development seed (~30-60s). Usa `--environment test` para seed rápido.

### Datos duplicados
Usa `--clear` para limpiar antes de seedear.

## 📚 Más Información

- [Prisma Seeding Docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)
- [Faker.js Docs](https://fakerjs.dev/)
