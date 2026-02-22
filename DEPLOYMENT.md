# RocNest - Guia de despliegue

## Despliegue en Vercel (Recomendado)

### Preparacion

1. **Asegurate de tener una cuenta de GitHub**
   - Sube tu codigo a un repositorio de GitHub
   - Commit y push de todos los cambios

2. **Crea una cuenta en Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Registrarse con GitHub

3. **Ten una base de datos PostgreSQL disponible**
   - Puedes usar cualquier proveedor de PostgreSQL (Neon, Railway, Render, AWS RDS, etc.)
   - Necesitas la URL de conexion (connection string)

### Paso 1: Import del Proyecto

1. En Vercel, click en "Add New..." → "Project"
2. Selecciona el repositorio `RocNest` de GitHub
3. Vercel detectara automaticamente que es un proyecto Next.js

### Paso 2: Configurar Variables de Entorno

Antes de hacer deploy, agrega las siguientes variables de entorno:

```
DATABASE_URL=postgresql://usuario:password@host:puerto/rocnest
DIRECT_URL=postgresql://usuario:password@host:puerto/rocnest
JWT_SECRET=tu-secreto-jwt-seguro
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

> **Importante**: `DATABASE_URL` es la URL de conexion a tu base de datos PostgreSQL. Si tu proveedor usa connection pooling, `DIRECT_URL` debe ser la conexion directa (sin pooling) para que Prisma pueda ejecutar migraciones.

### Paso 3: Deploy

1. Click en "Deploy"
2. Espera mientras Vercel construye el proyecto
3. Tu app estara disponible en la URL asignada por Vercel

### Paso 4: Ejecutar migraciones

Despues del primer deploy, ejecuta las migraciones de la base de datos:

```bash
# Desde tu maquina local, con las variables de entorno de produccion
DATABASE_URL="tu-url-de-produccion" npx prisma migrate deploy
```

### Paso 5: Dominio personalizado (Opcional)

1. En Vercel, ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los DNS segun las instrucciones de Vercel

## Verificacion post-deployment

### Checklist de pruebas

- [ ] La app carga correctamente en la URL
- [ ] La pagina de inicio muestra el diseno correcto
- [ ] Puedes registrarte como usuario nuevo
- [ ] Puedes hacer login
- [ ] Como usuario, puedes ver el catalogo y tus reservas
- [ ] Como admin, puedes gestionar inventario y aprobar reservas

## Troubleshooting

### Error de Build en Vercel

- Verifica que `package.json` tiene todas las dependencias
- Asegurate de que no hay errores de TypeScript localmente con `npm run build`
- Revisa los logs de build en Vercel

### Error de conexion a la base de datos

- Verifica que `DATABASE_URL` esta correctamente configurada
- Confirma que tu base de datos PostgreSQL permite conexiones desde Vercel (IPs de Vercel en whitelist)
- Verifica que las migraciones se ejecutaron correctamente

### Problemas de autenticacion

- Verifica que `JWT_SECRET` esta configurado
- Comprueba que la tabla `profiles` existe (ejecuta `npx prisma migrate deploy`)
