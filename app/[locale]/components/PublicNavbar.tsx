'use client'

import { Menu, X, Globe } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Dictionary, Locale, locales } from '@/lib/i18n'

export function PublicNavbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const otherLocale = locales.find((l) => l !== locale) || 'en'
  const localeLabel: Record<string, string> = { es: 'ES', en: 'EN' }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image src="/logo.png" alt="RocNest" width={32} height={32} priority />
            <span className="text-xl font-bold tracking-tight">RocNest</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={`/${locale}/features`}
              className="text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {dict.nav.features}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {dict.nav.pricing}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {dict.nav.about}
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <Link
              href={`/${otherLocale}`}
              className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              title={otherLocale === 'es' ? 'Cambiar a Español' : 'Switch to English'}
            >
              <Globe className="h-4 w-4" />
              {localeLabel[otherLocale]}
            </Link>

            <Link
              href="/login"
              className="text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {dict.nav.login}
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg shadow-[var(--color-primary)]/25"
            >
              {dict.nav.register}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--color-muted-foreground)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--color-border)]">
            <div className="flex flex-col gap-4">
              <Link
                href={`/${locale}/features`}
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.nav.features}
              </Link>
              <Link
                href={`/${locale}/pricing`}
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.nav.pricing}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.nav.about}
              </Link>
              <hr className="border-[var(--color-border)]" />
              <Link
                href={`/${otherLocale}`}
                className="flex items-center gap-2 text-sm py-2"
              >
                <Globe className="h-4 w-4" />
                {otherLocale === 'es' ? 'Español' : 'English'}
              </Link>
              <Link href="/login" className="text-sm font-medium py-2">
                {dict.nav.login}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
              >
                {dict.nav.register}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
