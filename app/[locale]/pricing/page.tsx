import { CheckCircle2, ArrowRight, X } from 'lucide-react'
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rocnest.com'

  const titles: Record<string, string> = {
    es: 'Precios - 100% Gratuito Para Siempre | RocNest',
    en: 'Pricing - 100% Free Forever | RocNest',
  }
  const descriptions: Record<string, string> = {
    es: 'RocNest es completamente gratuito. Sin planes premium, sin costes ocultos, sin límites. Gestión de material deportivo gratis para tu club.',
    en: 'RocNest is completely free. No premium plans, no hidden costs, no limits. Free sports equipment management for your club.',
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/pricing`,
      languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/pricing`])),
    },
  }
}

export default async function PricingPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { locale: rawLocale } = await params
  const locale = (isValidLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const dict = await getDictionary(locale)

  const comparisonData = locale === 'es'
    ? [
        { feature: 'Material/inventario', rocnest: 'Ilimitado', others: 'Limitado o de pago' },
        { feature: 'Usuarios/socios', rocnest: 'Ilimitados', others: 'Limitado o de pago' },
        { feature: 'Reservas', rocnest: 'Ilimitadas', others: 'Limitado o de pago' },
        { feature: 'Multi-organización', rocnest: true, others: false },
        { feature: 'Revisiones de seguridad', rocnest: true, others: false },
        { feature: 'Checklists personalizados', rocnest: true, others: false },
        { feature: 'Roles y permisos', rocnest: true, others: 'Plan premium' },
        { feature: 'Sin publicidad', rocnest: true, others: false },
        { feature: 'Soporte', rocnest: true, others: 'Solo premium' },
        { feature: 'Precio', rocnest: '0 EUR/siempre', others: '15-50 EUR/mes' },
      ]
    : [
        { feature: 'Equipment/inventory', rocnest: 'Unlimited', others: 'Limited or paid' },
        { feature: 'Users/members', rocnest: 'Unlimited', others: 'Limited or paid' },
        { feature: 'Bookings', rocnest: 'Unlimited', others: 'Limited or paid' },
        { feature: 'Multi-organization', rocnest: true, others: false },
        { feature: 'Safety reviews', rocnest: true, others: false },
        { feature: 'Custom checklists', rocnest: true, others: false },
        { feature: 'Roles & permissions', rocnest: true, others: 'Premium plan' },
        { feature: 'No advertising', rocnest: true, others: false },
        { feature: 'Support', rocnest: true, others: 'Premium only' },
        { feature: 'Price', rocnest: '$0/forever', others: '$15-50/month' },
      ]

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-4">
            {dict.pricing.sectionTag}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            {dict.pricing.title}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
            {dict.pricing.subtitle}
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="pb-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <div className="relative p-8 lg:p-10 rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-card)] shadow-2xl shadow-[var(--color-primary)]/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-sm font-bold">
              {dict.pricing.planName}
            </div>
            <div className="text-center mb-8 pt-4">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-6xl font-black">{dict.pricing.planPrice}</span>
                <span className="text-xl text-[var(--color-muted-foreground)]">
                  {dict.pricing.planPeriod}
                </span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {dict.pricing.features.map((feature: string) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full text-center py-4 px-6 text-lg font-bold rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-dark)] transition-all shadow-lg shadow-[var(--color-primary)]/30"
            >
              {dict.pricing.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 lg:py-24 bg-[var(--color-background-secondary)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {locale === 'es' ? 'RocNest vs. La competencia' : 'RocNest vs. The competition'}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--color-card)]">
                  <th className="text-left p-4 font-semibold">
                    {locale === 'es' ? 'Característica' : 'Feature'}
                  </th>
                  <th className="text-center p-4 font-semibold text-[var(--color-primary)]">
                    RocNest
                  </th>
                  <th className="text-center p-4 font-semibold text-[var(--color-muted-foreground)]">
                    {locale === 'es' ? 'Otros' : 'Others'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="border-t border-[var(--color-border)]">
                    <td className="p-4 text-sm">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.rocnest === 'boolean' ? (
                        row.rocnest ? (
                          <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)] mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-[var(--color-destructive)] mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-semibold text-[var(--color-primary)]">
                          {row.rocnest}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.others === 'boolean' ? (
                        row.others ? (
                          <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)] mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-[var(--color-destructive)] mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-[var(--color-muted-foreground)]">
                          {row.others}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
