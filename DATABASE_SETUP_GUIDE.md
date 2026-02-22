# Guia de configuracion de base de datos

## Requisitos

- PostgreSQL 14+ (local o remoto)
- Node.js 18+

## Configuracion

### 1. Crear la base de datos

```bash
# Opcion A: Con Docker (recomendado para desarrollo)
docker run -d \
  --name rocnest-db \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=toor \
  -e POSTGRES_DB=rocnest \
  -p 5555:5432 \
  postgres:16

# Opcion B: Con PostgreSQL local
createdb rocnest
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raiz del proyecto:

```
DATABASE_URL="postgresql://root:toor@localhost:5555/rocnest?schema=public"
NODE_ENV="development"
JWT_SECRET="tu-secreto-jwt"
```

Para produccion, usa la URL de tu base de datos PostgreSQL. Si necesitas una URL directa para migraciones (sin connection pooling), anade:

```
DIRECT_URL="postgresql://usuario:password@host:5432/rocnest?schema=public"
```

### 3. Ejecutar migraciones

```bash
# Aplicar todas las migraciones existentes
npm run db:migrate

# Generar el cliente Prisma
npx prisma generate
```

### 4. (Opcional) Cargar datos de ejemplo

```bash
npm run db:seed:dev
```

### 5. Verificar la configuracion

```bash
# Abrir Prisma Studio para inspeccionar la base de datos
npm run db:studio
```

## Esquema de la base de datos

El esquema completo esta definido en `prisma/schema.prisma` y se gestiona a traves de Prisma. Los modelos principales son:

| Modelo | Tabla | Descripcion |
|---|---|---|
| `Profile` | `profiles` | Usuarios del sistema (email, password, rol) |
| `Organization` | `organizations` | Organizaciones/clubes |
| `UserOrganization` | `user_organizations` | Relacion usuarios-organizaciones |
| `Category` | `categories` | Categorias de material |
| `Product` | `products` | Productos (marca, modelo) |
| `Item` | `items` | Items individuales de material |
| `Reservation` | `reservations` | Reservas de material |
| `Incident` | `incidents` | Incidencias reportadas |
| `ItemReview` | `item_reviews` | Revisiones de seguridad |

**Nota**: No existe una tabla `users` separada. Los usuarios se almacenan en la tabla `profiles` (modelo `Profile` en Prisma). La autenticacion se gestiona con JWT y las contrasenas se hashean con bcrypt.

## Crear usuario admin

Despues de ejecutar las migraciones y el seed, puedes crear un usuario admin registrandote desde la aplicacion y despues cambiando su rol:

```bash
# Abrir Prisma Studio
npm run db:studio
# Navegar a la tabla "profiles" y cambiar el campo "role" a "admin"
```

O directamente con SQL:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
```

## Migraciones

Las migraciones se encuentran en `prisma/migrations/`. Para crear una nueva migracion despues de modificar el schema:

```bash
npm run db:migrate
```

Para mas detalles sobre el uso de Prisma, consulta [PRISMA_GUIDE.md](PRISMA_GUIDE.md).
