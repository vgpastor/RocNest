import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with proper precedence
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format a date range for display
 */
export function formatDateRange(start: Date | string, end: Date | string): string {
    const startDate = typeof start === 'string' ? new Date(start) : start
    const endDate = typeof end === 'string' ? new Date(end) : end

    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })

    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): {
    badge: string
    bg: string
    text: string
} {
    const statusMap: Record<string, { badge: string; bg: string; text: string }> = {
        available: {
            badge: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
            bg: 'bg-[var(--color-success-bg)]',
            text: 'text-[var(--color-success)]'
        },
        confirmed: {
            badge: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
            bg: 'bg-[var(--color-success-bg)]',
            text: 'text-[var(--color-success)]'
        },
        active: {
            badge: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
            bg: 'bg-[var(--color-success-bg)]',
            text: 'text-[var(--color-success)]'
        },
        reserved: {
            badge: 'bg-[var(--color-reserved-bg)] text-[var(--color-reserved)]',
            bg: 'bg-[var(--color-reserved-bg)]',
            text: 'text-[var(--color-reserved)]'
        },
        pending: {
            badge: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
            bg: 'bg-[var(--color-warning-bg)]',
            text: 'text-[var(--color-warning)]'
        },
        cancelled: {
            badge: 'bg-[var(--color-destructive-bg)] text-[var(--color-destructive)]',
            bg: 'bg-[var(--color-destructive-bg)]',
            text: 'text-[var(--color-destructive)]'
        },
        maintenance: {
            badge: 'bg-[var(--color-destructive-bg)] text-[var(--color-destructive)]',
            bg: 'bg-[var(--color-destructive-bg)]',
            text: 'text-[var(--color-destructive)]'
        }
    }

    return statusMap[status.toLowerCase()] || statusMap.available
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number = 100): string {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
}
