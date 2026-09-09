'use client'

// Design System - Atom
// Lives in its own module so molecules (ConfirmDialog...) can import it without
// going through the barrel, which would create a cycle.

import { motion, HTMLMotionProps } from 'framer-motion'
import React from 'react'

import { cn } from '@/lib/utils'

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
