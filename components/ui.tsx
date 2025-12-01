'use client'

import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, LabelHTMLAttributes, forwardRef } from 'react'
import { Package, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardProps {
    children: ReactNode
    className?: string
}

export function Card({ children, className }: CardProps) {
    return (
        <div className={cn(
            'bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200',
            className
        )}>
            {children}
        </div>
    )
}

export function CardHeader({ children, className }: CardProps) {
    return (
        <div className={cn('p-6 pb-4', className)}>
            {children}
        </div>
    )
}

export function CardContent({ children, className }: CardProps) {
    return (
        <div className={cn('px-6 pb-6', className)}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className }: CardProps) {
    return (
        <h3 className={cn('text-xl font-bold text-gray-900 tracking-tight', className)}>
            {children}
        </h3>
    )
}

export function CardDescription({ children, className }: CardProps) {
    return (
        <p className={cn('text-sm text-gray-600 mt-1.5', className)}>
            {children}
        </p>
    )
}

interface BadgeProps {
    children: ReactNode
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'
    className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        default: 'bg-sky-100 text-sky-700 border-sky-200',
        success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-100 text-amber-700 border-amber-200',
        destructive: 'bg-rose-100 text-rose-700 border-rose-200',
        secondary: 'bg-gray-100 text-gray-700 border-gray-200',
    }

    return (
        <span className={cn(
            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
            variants[variant],
            className
        )}>
            {children}
        </span>
    )
}

interface ButtonProps {
    children: ReactNode
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
}

export function Button({
    children,
    variant = 'default',
    size = 'default',
    className,
    onClick,
    disabled = false,
    type = 'button'
}: ButtonProps) {
    const variants = {
        default: 'bg-gradient-to-r from-sky-500 to-violet-600 text-white hover:from-sky-600 hover:to-violet-700 shadow-lg shadow-sky-500/30 hover:shadow-xl',
        destructive: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/30',
        outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'text-gray-700 hover:bg-gray-100',
    }

    const sizes = {
        default: 'h-11 px-6 py-3',
        sm: 'h-9 rounded-xl px-4 text-sm',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-11 w-11',
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </button>
    )
}

interface AlertProps {
    children: ReactNode
    variant?: 'default' | 'success' | 'warning' | 'destructive'
    className?: string
}

export function Alert({ children, variant = 'default', className }: AlertProps) {
    const variants = {
        default: 'bg-sky-50 border-sky-200 text-sky-800',
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        destructive: 'bg-rose-50 border-rose-200 text-rose-800',
    }

    const icons = {
        default: Info,
        success: CheckCircle,
        warning: AlertTriangle,
        destructive: AlertTriangle,
    }

    const Icon = icons[variant]

    return (
        <div className={cn(
            'relative rounded-xl border p-4 flex items-start gap-3',
            variants[variant],
            className
        )}>
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{children}</div>
        </div>
    )
}

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description?: string
    action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="rounded-2xl bg-gray-100 p-4 mb-4">
                {icon || <Package className="h-10 w-10 text-gray-400" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-gray-600 mb-4 max-w-sm">{description}</p>
            )}
            {action}
        </div>
    )
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    className
                )}
                {...props}
            />
        )
    }
)
Label.displayName = "Label"
