import {
  Package,
  Calendar,
  Users,
  Shield,
  ClipboardCheck,
  Heart,
  CheckCircle2,
  ArrowRight,
  Mountain,
  Bike,
  Waves,
  Snowflake,
  Star,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

import { getDictionary, isValidLocale, defaultLocale, Locale } from '@/lib/i18n'

import { LandingStructuredData } from './components/LandingStructuredData'

type PageParams = { locale: string }

export default async function LandingPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { locale: rawLocale } = await params
  const locale = (isValidLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <LandingStructuredData locale={locale} dict={dict} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-primary)]/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-primary)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] text-sm font-semibold mb-8 border border-[var(--color-primary)]/20">
              <Zap className="h-4 w-4" />
              {dict.hero.badge}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              {dict.hero.title}{' '}
              <span className="text-gradient-primary">{dict.hero.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto mb-10 leading-relaxed">
              {dict.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-dark)] transition-all shadow-xl shadow-[var(--color-primary)]/30 hover:shadow-2xl hover:shadow-[var(--color-primary)]/40 hover:-translate-y-0.5"
              >
                {dict.hero.cta}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={`/${locale}/features`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-accent)] transition-all"
              >
                {dict.hero.ctaSecondary}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-muted-foreground)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" />
                {dict.hero.noCard}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" />
                {dict.hero.freeForever}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" />
                {dict.hero.setupTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-16 border-y border-[var(--color-border)] bg-[var(--color-background-secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">{dict.sports.title}</h2>
            <p className="text-[var(--color-muted-foreground)]">{dict.sports.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {[
              { icon: <Mountain className="h-6 w-6" />, label: dict.sports.mountain },
              { icon: <span className="text-2xl">🧗</span>, label: dict.sports.climbing },
              { icon: <span className="text-2xl">🏃</span>, label: dict.sports.running },
              { icon: <Bike className="h-6 w-6" />, label: dict.sports.cycling },
              { icon: <Snowflake className="h-6 w-6" />, label: dict.sports.skiing },
              { icon: <Waves className="h-6 w-6" />, label: dict.sports.diving },
              { icon: <span className="text-2xl">🛶</span>, label: dict.sports.kayak },
              { icon: <span className="text-2xl">+</span>, label: dict.sports.other },
            ].map((sport) => (
              <div key={sport.label} className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                {sport.icon}
                <span className="text-sm font-medium">{sport.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-4">
              {dict.features.sectionTag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              {dict.features.title}
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              {dict.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: <Package className="h-7 w-7" />,
                title: dict.features.inventory.title,
                description: dict.features.inventory.description,
              },
              {
                icon: <Calendar className="h-7 w-7" />,
                title: dict.features.reservations.title,
                description: dict.features.reservations.description,
              },
              {
                icon: <Users className="h-7 w-7" />,
                title: dict.features.multiOrg.title,
                description: dict.features.multiOrg.description,
              },
              {
                icon: <ClipboardCheck className="h-7 w-7" />,
                title: dict.features.reviews.title,
                description: dict.features.reviews.description,
              },
              {
                icon: <Shield className="h-7 w-7" />,
                title: dict.features.security.title,
                description: dict.features.security.description,
              },
              {
                icon: <Heart className="h-7 w-7" />,
                title: dict.features.free.title,
                description: dict.features.free.description,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative p-6 lg:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/30 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-5 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-[var(--color-background-secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-4">
              {dict.howItWorks.sectionTag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              {dict.howItWorks.title}
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              {dict.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '1', ...dict.howItWorks.step1 },
              { step: '2', ...dict.howItWorks.step2 },
              { step: '3', ...dict.howItWorks.step3 },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-2xl font-black mb-6 shadow-lg shadow-[var(--color-primary)]/30">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-4">
              {dict.testimonials.sectionTag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              {dict.testimonials.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[dict.testimonials.quote1, dict.testimonials.quote2, dict.testimonials.quote3].map(
              (testimonial, i) => (
                <div
                  key={i}
                  className="relative p-6 lg:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-[var(--color-warning)] text-[var(--color-warning)]"
                      />
                    ))}
                  </div>
                  <blockquote className="text-[var(--color-foreground)] mb-6 leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </blockquote>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28 bg-[var(--color-background-secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-4">
              {dict.pricing.sectionTag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              {dict.pricing.title}
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              {dict.pricing.subtitle}
            </p>
          </div>

          <div className="max-w-md mx-auto">
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
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-4">
              {dict.faq.sectionTag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              {dict.faq.title}
            </h2>
          </div>

          <div className="space-y-4">
            {dict.faq.items.map((item: { question: string; answer: string }, i: number) => (
              <details
                key={i}
                className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold hover:bg-[var(--color-accent)] transition-colors">
                  {item.question}
                  <span className="ml-4 text-[var(--color-primary)] group-open:rotate-180 transition-transform">
                    &#9660;
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[var(--color-muted-foreground)] leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]" />
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
            {dict.cta.title}
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            {dict.cta.subtitle}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-bold rounded-xl bg-white text-[var(--color-primary-dark)] hover:bg-white/90 transition-all shadow-2xl hover:-translate-y-0.5"
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
