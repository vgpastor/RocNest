/**
 * RocNest Specific Components
 * Domain-specific reusable components for the mountain equipment platform
 */

import Image from 'next/image'
import React from 'react'

import { cn, Badge, Card, CardFooter, CardHeader, CardTitle, CardDescription, Button } from '@/components'

/* ============================================
   LOGO COMPONENT
   ============================================ */
export interface LogoProps {
    size?: number
    showText?: boolean
    className?: string
}

export const Logo: React.FC<LogoProps> = ({
    size = 24,
    showText = false,
    className
}) => {
    return (
        <div className="flex items-center gap-3">
            <Image
                src="/logo.png"
                alt="RocNest Logo"
                width={size}
                height={size}
                className={cn('object-contain', className)}
                priority
            />
            {showText && (
                <h2 className="text-lg font-bold tracking-tight">RocNest</h2>
            )}
        </div>
    )
}

/* ============================================
   STATUS BADGE COMPONENT
   ============================================ */
export interface StatusBadgeProps {
    status: 'available' | 'reserved' | 'pending' | 'confirmed' | 'active' | 'cancelled' | 'maintenance'
    className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
    const statusConfig = {
        available: { variant: 'success' as const, label: 'Disponible' },
        confirmed: { variant: 'success' as const, label: 'Confirmada' },
        active: { variant: 'success' as const, label: 'Activa' },
        reserved: { variant: 'reserved' as const, label: 'Reservado' },
        pending: { variant: 'warning' as const, label: 'Pendiente' },
        cancelled: { variant: 'error' as const, label: 'Cancelada' },
        maintenance: { variant: 'error' as const, label: 'Mantenimiento' }
    }

    const config = statusConfig[status]

    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    )
}

/* ============================================
   EQUIPMENT CARD COMPONENT
   ============================================ */
export interface EquipmentCardProps {
    id: string
    name: string
    description: string
    imageUrl?: string
    status: 'available' | 'reserved'
    category?: string
    onViewDetails?: (id: string) => void
    className?: string
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
    id,
    name,
    description,
    imageUrl,
    status,
    category,
    onViewDetails,
    className
}) => {
    return (
        <Card hover className={cn('overflow-hidden', className)}>
            {imageUrl && (
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                        <StatusBadge status={status} />
                    </div>
                </div>
            )}
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <CardTitle>{name}</CardTitle>
                        <CardDescription className="mt-1">{description}</CardDescription>
                    </div>
                </div>
                {category && (
                    <span className="text-xs text-[var(--color-muted-foreground)] mt-2">
                        {category}
                    </span>
                )}
            </CardHeader>
            {onViewDetails && (
                <CardFooter>
                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => onViewDetails(id)}
                    >
                        Ver Detalles
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

/* ============================================
   METRIC CARD COMPONENT
   ============================================ */
export interface MetricCardProps {
    title: string
    value: string | number
    change?: {
        value: number
        label: string
    }
    icon?: React.ReactNode
    className?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    icon,
    className
}) => {
    const isPositive = change && change.value > 0
    const isNegative = change && change.value < 0

    return (
        <Card className={cn("relative overflow-hidden group hover:shadow-lg transition-all duration-300", className)}>
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
                        {title}
                    </p>
                    <p className="text-3xl font-black mt-2 tracking-tight">{value}</p>
                    {change && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={cn(
                                    'text-xs font-bold px-1.5 py-0.5 rounded-full',
                                    isPositive && 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
                                    isNegative && 'bg-[var(--color-destructive-bg)] text-[var(--color-destructive)]'
                                )}
                            >
                                {isPositive && '+'}
                                {change.value}%
                            </span>
                            <span className="text-xs text-[var(--color-muted-foreground)] ml-1">
                                {change.label}
                            </span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="p-3 rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    )
}

/* ============================================
   SEARCH BAR COMPONENT
   ============================================ */
export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onSearch?: (value: string) => void
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
    ({ className, onSearch, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onSearch?.(e.target.value)
            props.onChange?.(e)
        }

        return (
            <div className={cn('flex items-stretch rounded-lg h-12 overflow-hidden', className)}>
                <div className="flex items-center justify-center px-4 bg-[var(--color-primary-subtle)] text-[var(--color-muted-foreground)]">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    ref={ref}
                    type="search"
                    className={cn(
                        'flex-1 px-4 py-2 bg-[var(--color-primary-subtle)]',
                        'text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]',
                        'focus:outline-none focus:ring-0 border-none'
                    )}
                    onChange={handleChange}
                    {...props}
                />
            </div>
        )
    }
)
SearchBar.displayName = 'SearchBar'

/* ============================================
   FILTER SECTION COMPONENT
   ============================================ */
export interface FilterSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    icon?: React.ReactNode
    children: React.ReactNode
}

export const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    icon,
    children,
    className,
    ...props
}) => {
    return (
        <div className={cn('flex flex-col gap-2', className)} {...props}>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-primary-subtle)]">
                {icon}
                <p className="text-sm font-medium">{title}</p>
            </div>
            <div className="px-4 py-2">{children}</div>
        </div>
    )
}

/* ============================================
   PAGE HEADER COMPONENT
   ============================================ */
export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    action?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    action,
    className,
    ...props
}) => {
    return (
        <div className={cn('flex flex-wrap items-center justify-between gap-4 p-4', className)} {...props}>
            <div>
                <h1 className="text-4xl font-black tracking-tight">{title}</h1>
                {description && (
                    <p className="text-[var(--color-muted-foreground)] mt-2">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}
