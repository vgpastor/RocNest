/**
 * RocNest UI Components Library
 * Reusable React components following the RocNest design system
 */

import React from 'react'
import { cn } from '@/lib/utils'

/* ============================================
   BADGE COMPONENT
   ============================================ */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'reserved' | 'default' | 'secondary' | 'destructive'
    size?: 'sm' | 'md' | 'lg'
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const variantStyles = {
            success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
            warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
            error: 'bg-[var(--color-destructive-bg)] text-[var(--color-destructive)]',
            destructive: 'bg-[var(--color-destructive-bg)] text-[var(--color-destructive)]',
            info: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
            reserved: 'bg-[var(--color-reserved-bg)] text-[var(--color-reserved)]',
            secondary: 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
            default: 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]'
        }

        const sizeStyles = {
            sm: 'text-xs px-2 py-0.5',
            md: 'text-xs px-2.5 py-1',
            lg: 'text-sm px-3 py-1.5'
        }

        return (
            <span
                ref={ref}
                className={cn(
                    'badge inline-flex items-center font-semibold',
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        )
    }
)
Badge.displayName = 'Badge'

/* ============================================
   BUTTON COMPONENT
   ============================================ */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        const variantStyles = {
            primary: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-dark)] active:scale-95',
            secondary: 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:bg-opacity-30',
            outline: 'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-accent)]',
            ghost: 'bg-transparent hover:bg-[var(--color-accent)] text-[var(--color-primary)]',
            destructive: 'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-90'
        }

        const sizeStyles = {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 text-base',
            lg: 'h-12 px-6 text-lg'
        }

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'btn',
                    variantStyles[variant],
                    sizeStyles[size],
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)
Button.displayName = 'Button'

/* ============================================
   CARD COMPONENT
   ============================================ */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'card',
                    hover && 'card-hover cursor-pointer',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
    )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, children, ...props }, ref) => (
        <h3 ref={ref} className={cn('text-xl font-bold leading-tight', className)} {...props}>
            {children}
        </h3>
    )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn('text-sm text-[var(--color-muted-foreground)]', className)} {...props} />
    )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('pt-0', className)} {...props} />
    )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
    )
)
CardFooter.displayName = 'CardFooter'

/* ============================================
   INPUT COMPONENT
   ============================================ */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label className="text-sm font-medium text-[var(--color-foreground)]">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'input',
                        error && 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-[var(--color-destructive)]">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'

/* ============================================
   TEXTAREA COMPONENT
   ============================================ */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label className="text-sm font-medium text-[var(--color-foreground)]">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'input min-h-[80px] resize-y',
                        error && 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-[var(--color-destructive)]">{error}</p>
                )}
            </div>
        )
    }
)
Textarea.displayName = 'Textarea'

/* ============================================
   CHECKBOX COMPONENT
   ============================================ */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, id, ...props }, ref) => {
        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

        return (
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    ref={ref}
                    type="checkbox"
                    id={checkboxId}
                    className={cn(
                        'h-5 w-5 rounded border-2 border-[var(--color-input)] bg-transparent',
                        'text-[var(--color-primary)] checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)]',
                        'focus:ring-2 focus:ring-[var(--color-primary-subtle)] focus:ring-offset-0',
                        'transition-all cursor-pointer',
                        className
                    )}
                    {...props}
                />
                {label && (
                    <span className="text-base text-[var(--color-foreground)] select-none">
                        {label}
                    </span>
                )}
            </label>
        )
    }
)
Checkbox.displayName = 'Checkbox'

/* ============================================
   RADIO COMPONENT
   ============================================ */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
    ({ className, label, id, ...props }, ref) => {
        const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`

        return (
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    ref={ref}
                    type="radio"
                    id={radioId}
                    className={cn(
                        'h-4 w-4 border-2 border-[var(--color-input)]',
                        'text-[var(--color-primary)] focus:ring-[var(--color-primary)]',
                        'transition-all cursor-pointer',
                        className
                    )}
                    {...props}
                />
                {label && (
                    <span className="text-base text-[var(--color-foreground)] select-none">
                        {label}
                    </span>
                )}
            </label>
        )
    }
)
Radio.displayName = 'Radio'

/* ============================================
   SELECT COMPONENT
   ============================================ */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    options: Array<{ value: string; label: string }>
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label className="text-sm font-medium text-[var(--color-foreground)]">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'input cursor-pointer',
                        error && 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-sm text-[var(--color-destructive)]">{error}</p>
                )}
            </div>
        )
    }
)
Select.displayName = 'Select'

/* ============================================
   EMPTY STATE COMPONENT
   ============================================ */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: React.ReactNode
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    ({ className, icon, title, description, action, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-col items-center gap-6 rounded-lg border border-dashed',
                    'border-[var(--color-border)] p-12',
                    className
                )}
                {...props}
            >
                {icon && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-muted)]">
                        {icon}
                    </div>
                )}
                <div className="flex max-w-[480px] flex-col items-center gap-2 text-center">
                    <p className="text-lg font-bold">{title}</p>
                    {description && (
                        <p className="text-sm text-[var(--color-muted-foreground)]">{description}</p>
                    )}
                </div>
                {action}
            </div>
        )
    }
)
EmptyState.displayName = 'EmptyState'
