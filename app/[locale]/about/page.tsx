import { ArrowRight, ExternalLink, Heart, Mountain, Code, Users } from 'lucide-react'
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
    es: 'Sobre Nosotros - RocNest por RocStatus.com',
    en: 'About Us - RocNest by RocStatus.com',
  }
  const descriptions: Record<string, string> = {
    es: 'RocNest es un proyecto de RocStatus.com. Software gratuito de gestión de material deportivo creado con pasión por el deporte y la tecnología.',
    en: 'RocNest is a project by RocStatus.com. Free sports equipment management software built with passion for sports and technology.',
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/about`])),
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { locale: rawLocale } = await params
  const locale = (isValidLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const dict = await getDictionary(locale)

  const content = locale === 'es'
    ? {
        heroTitle: 'Nacido en la Montaña, Construido con Tecnología',
        heroSubtitle:
          'RocNest nace de la necesidad real de clubes deportivos que gestionaban su material con hojas de cálculo, WhatsApp y caos. Decidimos que merecían algo mejor.',
        missionTitle: 'Nuestra Misión',
        missionText:
          'Democratizar la gestión del material deportivo. Creemos que cada club, sin importar su tamaño o presupuesto, merece herramientas profesionales para gestionar su equipamiento. Por eso RocNest es y será siempre gratuito.',
        storyTitle: 'La Historia',
        storyParagraphs: [
          'Todo empezó en un club de montaña. El responsable de material llevaba el control de cuerdas, arneses y piolets en un Excel que nadie entendía. Las reservas se hacían por WhatsApp y siempre había líos.',
          'Nos preguntamos: ¿por qué no existe un software sencillo, moderno y gratuito para esto? Y así nació RocNest.',
          'RocNest es un proyecto de RocStatus.com, una empresa dedicada a crear herramientas tecnológicas que resuelven problemas reales. Nos apasiona el deporte y la tecnología, y RocNest es la combinación perfecta de ambos.',
        ],
        valuesTitle: 'Nuestros Valores',
        values: [
          {
            icon: 'heart',
            title: 'Gratis para siempre',
            description:
              'No creemos en freemiums engañosos. RocNest es gratuito porque las herramientas básicas de gestión no deberían costar dinero a un club deportivo.',
          },
          {
            icon: 'mountain',
            title: 'Nacido del deporte',
            description:
              'Entendemos las necesidades de los clubes deportivos porque somos deportistas. Cada funcionalidad nace de una necesidad real.',
          },
          {
            icon: 'code',
            title: 'Tecnología moderna',
            description:
              'Construido con las últimas tecnologías para ofrecer la mejor experiencia. Rápido, seguro y fácil de usar.',
          },
          {
            icon: 'users',
            title: 'Comunidad primero',
            description:
              'Escuchamos a nuestros usuarios y priorizamos las funcionalidades que más necesitan. Tu feedback guía nuestro desarrollo.',
          },
        ],
        rocstatusTitle: 'Un proyecto de RocStatus.com',
        rocstatusText:
          'RocStatus.com es una empresa tecnológica dedicada a crear herramientas que resuelven problemas reales. RocNest es uno de nuestros proyectos estrella, nacido de la pasión por el deporte y la innovación tecnológica.',
        rocstatusCta: 'Visita RocStatus.com',
      }
    : {
        heroTitle: 'Born in the Mountains, Built with Technology',
        heroSubtitle:
          'RocNest was born from the real needs of sports clubs managing their equipment with spreadsheets, WhatsApp and chaos. We decided they deserved something better.',
        missionTitle: 'Our Mission',
        missionText:
          'Democratize sports equipment management. We believe every club, regardless of size or budget, deserves professional tools to manage their equipment. That\'s why RocNest is and will always be free.',
        storyTitle: 'The Story',
        storyParagraphs: [
          'It all started at a mountain club. The equipment manager was tracking ropes, harnesses and ice axes on an Excel spreadsheet nobody understood. Bookings were made via WhatsApp and there was always confusion.',
          'We asked ourselves: why isn\'t there a simple, modern and free software for this? And so RocNest was born.',
          'RocNest is a project by RocStatus.com, a company dedicated to creating technology tools that solve real problems. We\'re passionate about sports and technology, and RocNest is the perfect combination of both.',
        ],
        valuesTitle: 'Our Values',
        values: [
          {
            icon: 'heart',
            title: 'Free forever',
            description:
              'We don\'t believe in deceptive freemiums. RocNest is free because basic management tools shouldn\'t cost money for a sports club.',
          },
          {
            icon: 'mountain',
            title: 'Born from sports',
            description:
              'We understand sports clubs\' needs because we are athletes. Every feature comes from a real need.',
          },
          {
            icon: 'code',
            title: 'Modern technology',
            description:
              'Built with the latest technologies to offer the best experience. Fast, secure and easy to use.',
          },
          {
            icon: 'users',
            title: 'Community first',
            description:
              'We listen to our users and prioritize the features they need most. Your feedback guides our development.',
          },
        ],
        rocstatusTitle: 'A project by RocStatus.com',
        rocstatusText:
          'RocStatus.com is a technology company dedicated to creating tools that solve real problems. RocNest is one of our flagship projects, born from the passion for sports and technological innovation.',
        rocstatusCta: 'Visit RocStatus.com',
      }

  const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart className="h-7 w-7" />,
    mountain: <Mountain className="h-7 w-7" />,
    code: <Code className="h-7 w-7" />,
    users: <Users className="h-7 w-7" />,
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            {content.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-muted-foreground)] leading-relaxed">
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24 bg-[var(--color-background-secondary)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">{content.missionTitle}</h2>
            <p className="text-lg text-[var(--color-muted-foreground)] leading-relaxed max-w-2xl mx-auto">
              {content.missionText}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">{content.storyTitle}</h2>
          <div className="space-y-6">
            {content.storyParagraphs.map((paragraph, i) => (
              <p key={i} className="text-lg text-[var(--color-muted-foreground)] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-[var(--color-background-secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">{content.valuesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.values.map((value) => (
              <div
                key={value.title}
                className="p-6 lg:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-5">
                  {iconMap[value.icon]}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RocStatus Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 lg:p-12 rounded-2xl border-2 border-[var(--color-primary)]/20 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">{content.rocstatusTitle}</h2>
              <p className="text-lg text-[var(--color-muted-foreground)] leading-relaxed mb-8 max-w-2xl mx-auto">
                {content.rocstatusText}
              </p>
              <a
                href="https://rocstatus.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-dark)] transition-all shadow-lg shadow-[var(--color-primary)]/30"
              >
                {content.rocstatusCta}
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
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
        </div>
      </section>
    </>
  )
}
