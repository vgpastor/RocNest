# Contribuir a RocNest

Gracias por tu interes en contribuir a RocNest! Este proyecto es open source y las contribuciones de la comunidad son fundamentales para mejorarlo.

## Formas de contribuir

- **Reportar bugs**: Abre un [issue](https://github.com/vgpastor/RocNest/issues) describiendo el problema
- **Proponer funcionalidades**: Crea un issue con la etiqueta `feature request`
- **Enviar codigo**: Haz un fork, crea una rama y envia un Pull Request
- **Documentacion**: Mejora el README, guias o comentarios en el codigo
- **Traducciones**: Ayuda a traducir la interfaz a mas idiomas

## Configuracion del entorno de desarrollo

### Requisitos

- Node.js 18+
- PostgreSQL (o [Supabase](https://supabase.com) gratuito)
- Git

### Pasos

```bash
# 1. Fork del repositorio en GitHub

# 2. Clonar tu fork
git clone https://github.com/TU_USUARIO/RocNest.git
cd RocNest

# 3. Anadir el repo original como upstream
git remote add upstream https://github.com/vgpastor/RocNest.git

# 4. Instalar dependencias
npm install

# 5. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# 6. Ejecutar migraciones
npm run db:migrate

# 7. Cargar datos de prueba
npm run db:seed:dev

# 8. Iniciar el servidor de desarrollo
npm run dev
```

## Flujo de trabajo

### 1. Crear una rama

```bash
# Sincronizar con upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crear rama desde main
git checkout -b feat/nombre-descriptivo
```

Convenciones de nombres de rama:

| Prefijo | Uso |
|---|---|
| `feat/` | Nueva funcionalidad |
| `fix/` | Correccion de bug |
| `docs/` | Documentacion |
| `refactor/` | Refactorizacion |
| `test/` | Tests |

### 2. Desarrollar

- Sigue las guias de [AGENTS.md](AGENTS.md) para principios de codigo
- Escribe tests para la nueva funcionalidad
- Asegurate de que el lint y el build pasan:

```bash
npm run lint:fix
npm run build
npm run test:run
```

### 3. Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: anadir filtro por estado en catalogo
fix: corregir error de paginacion en reservas
docs: actualizar guia de instalacion
refactor: extraer logica de validacion a use case
test: anadir tests para flujo de reserva
chore: actualizar dependencias
```

### 4. Pull Request

1. Haz push de tu rama a tu fork
2. Abre un Pull Request contra `main` del repositorio original
3. Describe claramente los cambios realizados
4. Enlaza el issue relacionado si existe (ej: `Closes #42`)

#### Plantilla de PR

```markdown
## Descripcion
[Breve descripcion de los cambios]

## Tipo de cambio
- [ ] Nueva funcionalidad
- [ ] Correccion de bug
- [ ] Refactorizacion
- [ ] Documentacion
- [ ] Tests

## Checklist
- [ ] Mi codigo sigue las guias del proyecto (AGENTS.md)
- [ ] He escrito tests que cubren los cambios
- [ ] `npm run lint:fix` pasa sin errores
- [ ] `npm run build` completa correctamente
- [ ] `npm run test:run` pasa sin errores
```

## Guias de codigo

### Principios generales

- **SOLID**: Aplica los principios SOLID en todo el codigo
- **Clean Code**: Funciones pequenas, nombres descriptivos, sin codigo duplicado
- **Mobile First**: Disena primero para movil
- **Server Components**: Usa Server Components por defecto, Client Components solo cuando es necesario

### Tecnologias

- **TypeScript**: Todo el codigo debe estar tipado
- **Tailwind CSS**: Usa las clases de utilidad y los design tokens definidos en `globals.css`
- **Prisma**: Para todas las operaciones de base de datos
- **Next.js App Router**: Sigue las convenciones del App Router

### Testing

- Escribe tests unitarios para logica de negocio
- Usa mocks para dependencias externas
- Sigue el patron AAA (Arrange, Act, Assert)
- Tests deben ser independientes y repetibles

Para mas detalles, consulta [AGENTS.md](AGENTS.md).

## Estructura de archivos

Al crear nuevos archivos, sigue la estructura existente:

- **Paginas**: `app/(app)/[seccion]/page.tsx`
- **API Routes**: `app/api/[recurso]/route.ts`
- **Componentes UI**: `components/ui/`
- **Componentes de dominio**: `components/rocnest/`
- **Layout**: `components/layout/`

## Reportar bugs

Abre un [issue](https://github.com/vgpastor/RocNest/issues/new) incluyendo:

1. **Descripcion** del problema
2. **Pasos para reproducir** el bug
3. **Comportamiento esperado** vs comportamiento actual
4. **Capturas de pantalla** si es relevante
5. **Entorno**: navegador, sistema operativo, version de Node.js

## Proponer funcionalidades

Abre un [issue](https://github.com/vgpastor/RocNest/issues/new) con:

1. **Descripcion** de la funcionalidad
2. **Motivacion**: por que es util
3. **Propuesta de implementacion** (opcional)
4. **Mockups o diagramas** si es relevante

## Codigo de conducta

- Se respetuoso con todos los participantes
- Acepta criticas constructivas con humildad
- Enfocate en lo que es mejor para la comunidad
- Muestra empatia hacia los demas

## Preguntas?

Si tienes dudas, abre un [issue](https://github.com/vgpastor/RocNest/issues) o contacta con el equipo en [RocStatus.com](https://rocstatus.com).

---

Gracias por contribuir a RocNest!
