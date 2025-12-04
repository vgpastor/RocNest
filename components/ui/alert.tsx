'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import React from 'react'

import { cn } from '@/lib/utils'

/* ============================================
   ALERT COMPONENT
   ============================================ */

export interface AlertProps extends HTMLMotionProps<"div"> {
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
    children?: React.ReactNode
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        const variantStyles = {
            default: 'bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-foreground)]',
            destructive: 'border-[var(--color-destructive)]/50 text-[var(--color-destructive)] dark:border-[var(--color-destructive)] [&>svg]:text-[var(--color-destructive)] bg-[var(--color-destructive)]/10',
            success: 'border-[var(--color-success)]/50 text-[var(--color-success)] dark:border-[var(--color-success)] [&>svg]:text-[var(--color-success)] bg-[var(--color-success)]/10',
            warning: 'border-[var(--color-warning)]/50 text-[var(--color-warning)] dark:border-[var(--color-warning)] [&>svg]:text-[var(--color-warning)] bg-[var(--color-warning)]/10',
            info: 'border-[var(--color-info)]/50 text-[var(--color-info)] dark:border-[var(--color-info)] [&>svg]:text-[var(--color-info)] bg-[var(--color-info)]/10',
        }

        const icons = {
            default: <Info className="h-4 w-4" />,
            destructive: <AlertCircle className="h-4 w-4" />,
            success: <CheckCircle2 className="h-4 w-4" />,
            warning: <AlertCircle className="h-4 w-4" />,
            info: <Info className="h-4 w-4" />,
        }

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className={cn(
                    'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-[var(--color-foreground)]',
                    variantStyles[variant],
                    className
                )}
                {...props}
            >
                {icons[variant]}
                <div className="text-sm [&_p]:leading-relaxed">
                    {children}
                </div>
            </motion.div>
        )
    }
)
Alert.displayName = 'Alert'

export const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
    )
)
AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
    )
)
AlertDescription.displayName = 'AlertDescription'
