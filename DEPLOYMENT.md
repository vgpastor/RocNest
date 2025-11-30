# Gear Hub - Deployment Guide

## Despliegue en Vercel (Recomendado)

### Preparación

1. **Asegúrate de tener una cuenta de GitHub**
   - Sube tu código a un repositorio de GitHub
   - Commit y push de todos los cambios

2. **Crea una cuenta en Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Registrarse con GitHub

### Paso 1: Import del Proyecto

1. En Vercel, click en "Add New..." → "Project"
2. Selecciona el repositorio `triple-exoplanet` de GitHub
3. Vercel detectará automáticamente que es un proyecto Next.js

### Paso 2: Configurar Variables de Entorno

Antes de hacer deploy, agrega las siguientes variables de entorno:

```
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

> **Importante**: Estas se obtienen del dashboard de Supabase en Settings → API

### Paso 3: Deploy

1. Click en "Deploy"
2. Espera 2-3 minutos mientras Vercel construye el proyecto
3. ¡Listo! Tu app estará disponible en una URL como `https://gear-hub-xxx.vercel.app`

### Paso 4: Dominio Personalizado (Opcional)

1. En Vercel, ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

## Setup de Supabase

### Crear Proyecto

1. Ir a [supabase.com](https://supabase.com) y crear cuenta
2. "New Project"
   - Nombre: gear-hub
   - Password: **Guardar en lugar seguro**
   - Region: Elegir la más cercana (Europe West para España)

### Ejecutar Schema SQL

1. Ir a "SQL Editor" en Supabase
2. Copiar y pegar TODO el contenido de `SUPABASE_SETUP.md`
3. Ejecutar ("Run")
4. Verificar que las tablas se crearon en "Table Editor"

### Obtener Credenciales

1. Ir a Settings → API
2. Copiar:
   - **Project URL** → Esta es tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Esta es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Crear Usuario Admin

1. Ir a Authentication → Users
2. Click "Add user" → Create new user
3. Rellenar email y password
4. Guardar el user ID
5. Ir a Table Editor → profiles
6. Buscar el registro del usuario (por email)
7. Editar y cambiar `role` de `'user'` a `'admin'`
8. Guardar

## Verificación Post-Deployment

### Checklist de Pruebas

- [ ] La app carga correctamente en la URL de Vercel
- [ ] La página de inicio muestra el diseño correcto
- [ ] El catálogo muestra items (una vez conectado a Supabase)
- [ ] Puedes registrarte como usuario nuevo
- [ ] Puedes hacer login
- [ ] Como usuario, puedes ver tus reservas
- [ ] Como admin, puedes ver el dashboard
- [ ] Como admin, puedes aprobar reservas
- [ ] Como admin, puedes gestionar inventario

## Troubleshooting

### Error de Build en Vercel

- Verifica que `package.json` tiene todas las dependencias
- Asegúrate de que no hay errores de TypeScript localmente
- Revisa los logs de build en Vercel

### Error de Conexión a Supabase

- Verifica que las variables de entorno están configuradas correctamente
- Confirma que las credenciales son las correctas (URL y anon key)
- Verifica que el schema SQL se ejecutó completamente

### Problemas de Autenticación

- Verifica que el trigger `on_auth_user_created` se creó correctamente
- Comprueba que las políticas RLS están activas
- Revisa los logs en Supabase → Logs

## Próximos Pasos

Una vez desplegado y verificado:

1. **Conectar datos reales**: Reemplazar los datos mock con queries de Supabase
2. **Añadir autenticación**: Implementar login/signup
3. **Poblar el inventario**: Añadir tu material real desde el panel de admin

## Soporte

Si encuentras problemas durante el deployment:
- Revisa la [documentación de Vercel](https://vercel.com/docs)
- Consulta la [documentación de Supabase](https://supabase.com/docs)
- Verifica los logs en ambas plataformas
