import Image from 'next/image'
import Link from 'next/link'

import { Locale } from '@/lib/i18n'

type DictionaryValue = string | string[] | { [key: string]: DictionaryValue }
type Dictionary = Record<string, DictionaryValue>

export function PublicFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background-secondary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="RocNest" width={32} height={32} />
              <span className="text-xl font-bold">RocNest</span>
            </Link>
            <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-4">
              {dict.footer.description}
            </p>
            <a
              href="https://rocstatus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              {dict.footer.aProjectOf} RocStatus.com &rarr;
            </a>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{dict.footer.product}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/features`}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  {dict.nav.features}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/pricing`}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  {dict.nav.pricing}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  {dict.nav.login}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  {dict.nav.register}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{dict.footer.resources}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  {dict.footer.about}
                </Link>
              </li>
              <li>
                <a
                  href="https://rocstatus.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  RocStatus.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{dict.footer.legal}</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  {dict.footer.privacy}
                </span>
              </li>
              <li>
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  {dict.footer.terms}
                </span>
              </li>
              <li>
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  {dict.footer.cookies}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-muted-foreground)]">
            &copy; {currentYear} RocNest. {dict.footer.allRightsReserved} {dict.footer.aProjectOf}{' '}
            <a
              href="https://rocstatus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              RocStatus.com
            </a>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--color-muted-foreground)]">
              {dict.footer.madeWith} &#9829; {dict.footer.by}{' '}
              <a
                href="https://rocstatus.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline"
              >
                RocStatus.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
