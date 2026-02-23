/**
 * RocNest UI Components Library
 * Reusable React components following the RocNest design system
 */

'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import React, { useId } from 'react'

import { cn } from '@/lib/utils'

/* ============================================
   BADGE COMPONENT
   ============================================ */
export interface BadgeProps extends HTMLMotionProps<"span"> {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'reserved' | 'default' | 'secondary' | 'destructive'
    size?: 'sm' | 'md' | 'lg'
    children?: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const variantStyles = {
            success: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success)]/20',
            warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning)]/20',
            error: 'bg-[var(--color-destructive-bg)] text-[var(--color-destructive)] border border-[var(--color-destructive)]/20',
            destructive: 'bg-[var(--color-destructive-bg)] text-[var(--color-destructive)] border border-[var(--color-destructive)]/20',
            info: 'bg-[var(--color-info-bg)] text-[var(--color-info)] border border-[var(--color-info)]/20',
            reserved: 'bg-[var(--color-reserved-bg)] text-[var(--color-reserved)] border border-[var(--color-reserved)]/20',
            secondary: 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] border border-[var(--color-border)]',
            default: 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border border-[var(--color-border)]'
        }

        const sizeStyles = {
            sm: 'text-[10px] px-2 py-0.5',
            md: 'text-xs px-2.5 py-1',
            lg: 'text-sm px-3 py-1.5'
        }

        return (
            <motion.span
                ref={ref}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                    'badge inline-flex items-center font-semibold backdrop-blur-sm',
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
            </motion.span>
        )
    }
)
Badge.displayName = 'Badge'

/* ============================================
   BUTTON COMPONENT
   ============================================ */
export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glow'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    isLoading?: boolean
    children?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        const variantStyles = {
            primary: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/20',
            secondary: 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:bg-opacity-30',
            outline: 'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-accent)] hover:border-[var(--color-primary)]/50',
            ghost: 'bg-transparent hover:bg-[var(--color-accent)] text-[var(--color-primary)]',
            destructive: 'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-90 shadow-lg shadow-[var(--color-destructive)]/20',
            glow: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] glow hover:bg-[var(--color-primary-dark)]'
        }

        const sizeStyles = {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 text-base',
            lg: 'h-12 px-6 text-lg',
            icon: 'h-10 w-10 p-2 flex items-center justify-center'
        }

        return (
            <motion.button
                ref={ref}
                disabled={disabled || isLoading}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'btn relative overflow-hidden',
                    variantStyles[variant],
                    sizeStyles[size],
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:y-0',
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
            </motion.button>
        )
    }
)
Button.displayName = 'Button'

/* ============================================
   CARD COMPONENT
   ============================================ */
export interface CardProps extends HTMLMotionProps<"div"> {
    hover?: boolean
    glass?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover, glass = true, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={hover ? { y: -5, boxShadow: 'var(--shadow-xl)' } : undefined}
                transition={{ duration: 0.3 }}
                className={cn(
                    'rounded-xl border border-[var(--color-border)]',
                    glass ? 'glass-panel' : 'bg-[var(--color-card)]',
                    hover && 'cursor-pointer transition-colors hover:border-[var(--color-primary)]/30',
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 pb-2', className)} {...props} />
    )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, children, ...props }, ref) => (
        <h3 ref={ref} className={cn('text-xl font-bold leading-tight tracking-tight', className)} {...props}>
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
        <div ref={ref} className={cn('p-6 pt-2', className)} {...props} />
    )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
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
            <div className="flex flex-col gap-2 group">
                {label && (
                    <label className="text-sm font-medium text-[var(--color-foreground)] group-focus-within:text-[var(--color-primary)] transition-colors">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm ring-offset-[var(--color-background)]',
                        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'placeholder:text-[var(--color-muted-foreground)]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-all duration-200',
                        error && 'border-[var(--color-destructive)] focus-visible:ring-[var(--color-destructive)]',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-[var(--color-destructive)]"
                    >
                        {error}
                    </motion.p>
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
            <div className="flex flex-col gap-2 group">
                {label && (
                    <label className="text-sm font-medium text-[var(--color-foreground)] group-focus-within:text-[var(--color-primary)] transition-colors">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'flex min-h-[80px] w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm ring-offset-[var(--color-background)]',
                        'placeholder:text-[var(--color-muted-foreground)]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-all duration-200 resize-y',
                        error && 'border-[var(--color-destructive)] focus-visible:ring-[var(--color-destructive)]',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-[var(--color-destructive)]"
                    >
                        {error}
                    </motion.p>
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
        const generatedId = useId()
        const checkboxId = id || generatedId

        return (
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={checkboxId}
                        className={cn(
                            'peer h-5 w-5 appearance-none rounded border-2 border-[var(--color-input)] bg-[var(--color-background)]',
                            'checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)]',
                            'focus:ring-2 focus:ring-[var(--color-primary-subtle)] focus:ring-offset-0',
                            'transition-all duration-200 cursor-pointer',
                            className
                        )}
                        {...props}
                    />
                    <svg
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="14"
                        height="14"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                {label && (
                    <span className="text-base text-[var(--color-foreground)] select-none group-hover:text-[var(--color-primary)] transition-colors">
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
        const generatedId = useId()
        const radioId = id || generatedId

        return (
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                    <input
                        ref={ref}
                        type="radio"
                        id={radioId}
                        className={cn(
                            'peer h-5 w-5 appearance-none rounded-full border-2 border-[var(--color-input)] bg-[var(--color-background)]',
                            'checked:border-[var(--color-primary)]',
                            'focus:ring-2 focus:ring-[var(--color-primary-subtle)] focus:ring-offset-0',
                            'transition-all duration-200 cursor-pointer',
                            className
                        )}
                        {...props}
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)] opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                </div>
                {label && (
                    <span className="text-base text-[var(--color-foreground)] select-none group-hover:text-[var(--color-primary)] transition-colors">
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
            <div className="flex flex-col gap-2 group">
                {label && (
                    <label className="text-sm font-medium text-[var(--color-foreground)] group-focus-within:text-[var(--color-primary)] transition-colors">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            'flex h-10 w-full appearance-none rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm ring-offset-[var(--color-background)]',
                            'text-[var(--color-foreground)]',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'transition-all duration-200 cursor-pointer',
                            error && 'border-[var(--color-destructive)] focus-visible:ring-[var(--color-destructive)]',
                            className
                        )}
                        {...props}
                    >
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-[var(--color-background)] text-[var(--color-foreground)]"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </div>
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-[var(--color-destructive)]"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        )
    }
)
Select.displayName = 'Select'

/* ============================================
   EMPTY STATE COMPONENT
   ============================================ */
export interface EmptyStateProps extends HTMLMotionProps<"div"> {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: React.ReactNode
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    ({ className, icon, title, description, action, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                    'flex flex-col items-center gap-6 rounded-xl border border-dashed',
                    'border-[var(--color-border)] p-12 bg-[var(--color-background-secondary)]/50',
                    className
                )}
                {...props}
            >
                {icon && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
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
            </motion.div>
        )
    }
)
EmptyState.displayName = 'EmptyState'
/* ============================================
   DIALOG COMPONENT
   ============================================ */
export * from './dialog'

/* ============================================
   ALERT COMPONENT
   ============================================ */
export * from './alert'

/* ============================================
   COMBOBOX COMPONENT
   ============================================ */
export * from './combobox'
export * from './label'
