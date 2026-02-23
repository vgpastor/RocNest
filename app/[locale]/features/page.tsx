import {
  Package,
  Calendar,
  Users,
  Shield,
  ClipboardCheck,
  Heart,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import { getDictionary, isValidLocale, defaultLocale, locales, Locale } from '@/lib/i18n'

type PageParams = { locale: string }

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rocnest.app'

  const titles: Record<string, string> = {
    es: 'Funcionalidades - Software Completo de Gestión de Material Deportivo',
    en: 'Features - Complete Sports Equipment Management Software',
  }
  const descriptions: Record<string, string> = {
    es: 'Inventario completo, reservas inteligentes, revisiones de seguridad, multi-organización y más. Descubre todas las funcionalidades de RocNest para tu club deportivo.',
    en: 'Complete inventory, smart bookings, safety reviews, multi-organization and more. Discover all RocNest features for your sports club.',
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/features`,
      languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/features`])),
    },
  }
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { locale: rawLocale } = await params
  const locale = (isValidLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const dict = await getDictionary(locale)

  const detailedFeatures = [
    {
      icon: <Package className="h-8 w-8" />,
      title: dict.features.inventory.title,
      description: dict.features.inventory.description,
      details:
        locale === 'es'
          ? [
              'Catálogo completo de material con fotos',
              'Estado de cada pieza en tiempo real',
              'Historial de uso y préstamos',
              'Categorías y subcategorías personalizables',
              'Campos de metadatos configurables',
              'Trazabilidad completa del material',
            ]
          : [
              'Complete equipment catalog with photos',
              'Real-time status for each piece',
              'Usage and loan history',
              'Customizable categories and subcategories',
              'Configurable metadata fields',
              'Complete equipment traceability',
            ],
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: dict.features.reservations.title,
      description: dict.features.reservations.description,
      details:
        locale === 'es'
          ? [
              'Reservas online para socios',
              'Control de disponibilidad automático',
              'Entrega y devolución con confirmación',
              'Extensión de reservas',
              'Historial completo de préstamos',
              'Notificaciones de vencimiento',
            ]
          : [
              'Online bookings for members',
              'Automatic availability control',
              'Delivery and return with confirmation',
              'Booking extensions',
              'Complete loan history',
              'Expiry notifications',
            ],
    },
    {
      icon: <ClipboardCheck className="h-8 w-8" />,
      title: dict.features.reviews.title,
      description: dict.features.reviews.description,
      details:
        locale === 'es'
          ? [
              'Checklists de revisión personalizables',
              'Programación de revisiones periódicas',
              'Registro de estado y deterioro',
              'Historial de mantenimiento',
              'Alertas de material que necesita revisión',
              'Cumplimiento normativo de seguridad',
            ]
          : [
              'Customizable review checklists',
              'Periodic review scheduling',
              'Status and deterioration tracking',
              'Maintenance history',
              'Alerts for equipment needing review',
              'Safety compliance',
            ],
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: dict.features.multiOrg.title,
      description: dict.features.multiOrg.description,
      details:
        locale === 'es'
          ? [
              'Múltiples organizaciones desde una cuenta',
              'Invitaciones por email',
              'Roles diferenciados (admin, miembro)',
              'Inventarios independientes por organización',
              'Configuración individual por club',
              'Ideal para federaciones deportivas',
            ]
          : [
              'Multiple organizations from one account',
              'Email invitations',
              'Differentiated roles (admin, member)',
              'Independent inventories per organization',
              'Individual settings per club',
              'Ideal for sports federations',
            ],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: dict.features.security.title,
      description: dict.features.security.description,
      details:
        locale === 'es'
          ? [
              'Datos cifrados en tránsito y reposo',
              'Autenticación segura con JWT',
              'Control de acceso por roles',
              'Auditoría de todas las acciones',
              'Cumplimiento RGPD',
              'Infraestructura cloud segura',
            ]
          : [
              'Data encrypted in transit and at rest',
              'Secure JWT authentication',
              'Role-based access control',
              'Full action audit trail',
              'GDPR compliant',
              'Secure cloud infrastructure',
            ],
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: dict.features.free.title,
      description: dict.features.free.description,
      details:
        locale === 'es'
          ? [
              'Sin límites de usuarios',
              'Sin límites de material',
              'Sin límites de reservas',
              'Sin publicidad',
              'Actualizaciones gratuitas',
              'Soporte incluido',
            ]
          : [
              'No user limits',
              'No equipment limits',
              'No booking limits',
              'No advertising',
              'Free updates',
              'Support included',
            ],
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-4">
            {dict.features.sectionTag}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            {dict.features.title}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
            {dict.features.subtitle}
          </p>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 lg:space-y-24">
            {detailedFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                      {feature.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">{feature.title}</h2>
                  </div>
                  <p className="text-lg text-[var(--color-muted-foreground)] mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full max-w-md">
                  <div className="aspect-video rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 flex items-center justify-center">
                    <div className="text-[var(--color-primary)] opacity-30">{feature.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">{dict.cta.title}</h2>
          <p className="text-lg text-white/80 mb-8">{dict.cta.subtitle}</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-bold rounded-xl bg-white text-[var(--color-primary-dark)] hover:bg-white/90 transition-all shadow-2xl"
          >
            {dict.cta.button}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-white/60">{dict.cta.note}</p>
        </div>
      </section>
    </>
  )
}
