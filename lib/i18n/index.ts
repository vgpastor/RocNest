export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

export type Dictionary = typeof import('./dictionaries/es.json')

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import('./dictionaries/es.json').then((mod) => mod.default),
  en: () => import('./dictionaries/en.json').then((mod) => mod.default),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loadDictionary = dictionaries[locale]
  if (!loadDictionary) {
    return dictionaries[defaultLocale]()
  }
  return loadDictionary()
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
