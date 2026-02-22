<p align="center">
  <img src="public/logo.png" alt="RocNest" width="120" />
</p>

<h1 align="center">RocNest</h1>

<p align="center">
  <strong>Software open source de gestion de material deportivo para clubes y organizaciones</strong>
</p>

<p align="center">
  <a href="https://github.com/vgpastor/RocNest/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="License"></a>
  <a href="https://github.com/vgpastor/RocNest/issues"><img src="https://img.shields.io/github/issues/vgpastor/RocNest.svg" alt="Issues"></a>
  <a href="https://github.com/vgpastor/RocNest/pulls"><img src="https://img.shields.io/github/issues-pr/vgpastor/RocNest.svg" alt="Pull Requests"></a>
  <a href="https://github.com/vgpastor/RocNest/stargazers"><img src="https://img.shields.io/github/stars/vgpastor/RocNest.svg" alt="Stars"></a>
</p>

<p align="center">
  <a href="https://rocnest.com">Web</a> &middot;
  <a href="#funcionalidades">Funcionalidades</a> &middot;
  <a href="#inicio-rapido">Inicio rapido</a> &middot;
  <a href="CONTRIBUTING.md">Contribuir</a> &middot;
  <a href="https://rocstatus.com">RocStatus.com</a>
</p>

---

## Que es RocNest?

RocNest es una plataforma **open source y 100% gratuita** para gestionar el material deportivo de tu club, federacion u organizacion. Controla inventario, reservas, prestamos y revisiones de seguridad desde un solo lugar.

Construido con tecnologias modernas, pensado para ser rapido, seguro y facil de usar.

**Es gratis porque es open source.** El codigo esta aqui, es transparente, y cualquiera puede contribuir.

## Funcionalidades

| | Funcionalidad | Descripcion |
|---|---|---|
| **Inventario** | Control total del material | Registra cada pieza con fotos, categorias, estado e historial completo |
| **Reservas** | Sistema de reservas y prestamos | Los socios reservan online con comprobacion automatica de disponibilidad |
| **Multi-Organizacion** | Gestiona varios clubes | Multiples clubes o secciones desde una sola cuenta |
| **Revisiones** | Revisiones de seguridad | Checklists personalizados, historial de mantenimiento y alertas |
| **Seguridad** | Roles y permisos | Control de acceso granular, datos cifrados y trazabilidad completa |
| **Responsive** | Funciona en cualquier dispositivo | Diseno mobile-first adaptado a escritorio, tablet y movil |

## Para quien es RocNest?

- Clubes de montana, escalada, senderismo y trekking
- Clubes de running y trail running
- Clubes de ciclismo
- Clubes de esqui y snowboard
- Clubes de buceo, kayak y piragueismo
- Federaciones deportivas
- Cualquier organizacion con material deportivo compartido

## Tech Stack

| Capa | Tecnologia |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Frontend | [React 19](https://react.dev), [TypeScript](https://typescriptlang.org) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com) |
| ORM | [Prisma 7](https://prisma.io) |
| Base de datos | PostgreSQL |
| Auth | JWT ([jose](https://github.com/panva/jose)) |
| Testing | [Vitest](https://vitest.dev) |
| Animaciones | [Framer Motion](https://motion.dev) |

## Inicio rapido

### Requisitos previos

- Node.js 18+
- PostgreSQL (o cuenta en [Supabase](https://supabase.com))
- npm, yarn o pnpm

### Instalacion

```bash
# 1. Clonar el repositorio
git clone https://github.com/vgpastor/RocNest.git
cd RocNest

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# 4. Ejecutar migraciones
npm run db:migrate

# 5. (Opcional) Cargar datos de ejemplo
npm run db:seed:dev

# 6. Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Iniciar en produccion |
| `npm run lint` | Ejecutar linter |
| `npm run lint:fix` | Corregir errores de lint |
| `npm run test` | Ejecutar tests |
| `npm run test:run` | Tests en modo CI |
| `npm run db:migrate` | Ejecutar migraciones |
| `npm run db:seed` | Cargar seed de datos |
| `npm run db:studio` | Abrir Prisma Studio |

## Estructura del proyecto

```
RocNest/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Paginas de autenticacion (login, registro)
│   ├── (app)/              # Paginas protegidas (dashboard, catalogo, reservas)
│   ├── api/                # API Routes
│   ├── layout.tsx          # Layout raiz
│   └── globals.css         # Estilos globales y design tokens
├── components/
│   ├── layout/             # Header, Sidebar, AppLayout
│   ├── rocnest/            # Componentes de dominio
│   └── ui/                 # Componentes UI reutilizables
├── lib/                    # Utilidades y configuracion
├── prisma/                 # Schema y migraciones
├── public/                 # Assets estaticos
└── tests/                  # Tests
```

## Contribuir

Las contribuciones son bienvenidas! Consulta la guia [CONTRIBUTING.md](CONTRIBUTING.md) para saber como empezar.

Formas de contribuir:

- Reportar bugs via [Issues](https://github.com/vgpastor/RocNest/issues)
- Proponer nuevas funcionalidades
- Enviar Pull Requests
- Mejorar la documentacion
- Traducir a otros idiomas

## Licencia

RocNest es software open source bajo la licencia [AGPL-3.0](LICENSE).

Esto significa que puedes usar, modificar y distribuir el software libremente, pero si lo despliegas como servicio web debes publicar tu codigo fuente completo bajo la misma licencia.

## Un proyecto de RocStatus.com

<a href="https://rocstatus.com">
  <img src="https://img.shields.io/badge/by-RocStatus.com-10b981.svg" alt="RocStatus.com">
</a>

RocNest es un proyecto de [RocStatus.com](https://rocstatus.com), creado con pasion por el deporte y la tecnologia.
