# AGENTS.md - Development Guidelines

Guidelines for AI agents (Claude Code, Copilot, Cursor, etc.) and human contributors working on RocNest.

## Project Overview

**RocNest** is an open source sports equipment management platform built with Next.js 16 (App Router), React 19, TypeScript, Prisma 7 and Tailwind CSS 4. Licensed under AGPL-3.0.

## Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 with custom design tokens in `app/globals.css` |
| Font | Lexend (Google Fonts via `next/font`) |
| ORM | Prisma 7 |
| Database | PostgreSQL (Supabase) |
| Auth | JWT with `jose` library |
| Testing | Vitest |
| Animations | Framer Motion |
| Icons | Lucide React |
| Toasts | Sonner |

### Directory Structure

```
RocNest/
├── app/
│   ├── (auth)/             # Auth pages (login, register) - public
│   │   ├── login/
│   │   └── register/
│   ├── (app)/              # Protected pages (requires auth)
│   │   ├── catalog/        # Equipment catalog, reviews, checklists
│   │   ├── reservations/   # Booking management
│   │   ├── configuration/  # Admin settings, members
│   │   └── organizations/  # Organization creation
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout (metadata, fonts, lang)
│   └── globals.css         # Design system tokens
├── components/
│   ├── layout/             # AppLayout, Header, Sidebar
│   ├── rocnest/            # Domain-specific components (Logo, StatusBadge, etc.)
│   └── ui/                 # Reusable UI primitives (Button, Card, Input, etc.)
├── lib/                    # Utilities, auth helpers, i18n config
├── prisma/                 # Schema, migrations, seeds
├── public/                 # Static assets, llms.txt, logos
└── tests/                  # Test files
```

### Key Patterns

- **Server Components by default**: Only use `'use client'` when needed (state, effects, browser APIs)
- **Route Groups**: `(auth)` for public auth pages, `(app)` for protected pages
- **Middleware**: Auth check via JWT in cookies, redirects to `/login` if unauthenticated
- **Multi-tenancy**: Organization-based isolation via `organizationId` on all data
- **Design tokens**: Defined as CSS custom properties in `globals.css`, referenced via `var(--color-*)`

## Development Principles

### 1. SOLID & Clean Code

- Single responsibility per function/component
- Small, focused functions with descriptive names
- No code duplication (DRY)
- Composition over inheritance
- Depend on abstractions, not implementations

### 2. Domain-Driven Design

- Domain entities without external dependencies
- Immutable value objects
- Specific domain errors
- Repository pattern (interface in domain, implementation in infrastructure)

### 3. Outside-In Development

1. Define public interface (API route / component props)
2. Write acceptance test
3. Implement from outside (controller) to inside (domain)
4. Implement infrastructure last

### 4. Testing

- Unit tests for business logic with mocks
- Follow AAA pattern (Arrange, Act, Assert)
- Tests must be independent and repeatable
- Name tests: `should[Behavior]When[Condition]`
- Framework: Vitest

### 5. Frontend

- **Mobile first**: Design for mobile, then scale up
- **Tailwind breakpoints**: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- **Server Components** when possible
- **Responsive**: All pages must work on mobile, tablet, and desktop
- **Accessibility**: Semantic HTML, proper labels, keyboard navigation

### 6. Self-Documenting Code

- Minimize comments; code should be readable on its own
- Use comments only for business decisions, external API limitations, or temporary workarounds
- JSDoc for public APIs

## Design System

### Colors

Defined in `app/globals.css` as CSS custom properties:

- **Primary**: Emerald green (`--color-primary`)
- **Background**: Light/dark aware via `light-dark()`
- **Semantic**: Success, Warning, Destructive, Info, Reserved

### Components

Reusable components in `components/ui/index.tsx`:
- Badge, Button, Card, Input, Textarea, Checkbox, Radio, Select
- Dialog, Alert, Combobox, Label, EmptyState

Domain components in `components/rocnest/index.tsx`:
- Logo, StatusBadge, EquipmentCard, MetricCard, SearchBar, FilterSection, PageHeader

## Validation Checklist

Before completing any task:

- [ ] `npm run lint:fix` passes without critical errors
- [ ] `npm run build` completes without errors
- [ ] `npm run test:run` passes (if tests exist for affected area)
- [ ] Code follows SOLID principles
- [ ] Frontend is mobile-first and responsive
- [ ] Server Components used where possible
- [ ] No hardcoded strings (use i18n when available)

**These checks are mandatory before any commit.**

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add status filter to equipment catalog
fix: correct pagination in reservations list
docs: update installation guide
refactor: extract validation logic to use case
test: add tests for booking flow
chore: update dependencies
```

## Environment Variables

Required variables (see `.env.example`):

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Direct DB URL (for Prisma migrations) |
| `NEXT_PUBLIC_BASE_URL` | Public URL of the application |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `JWT_SECRET` | Secret for JWT signing |

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint:fix     # Fix linting issues
npm run test:run     # Run tests (CI mode)
npm run db:migrate   # Run Prisma migrations
npm run db:seed:dev  # Seed development data
npm run db:studio    # Open Prisma Studio
```
