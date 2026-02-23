'use client'

import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'
import { X } from 'lucide-react'
import React, { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

import { Button } from './index'

/* ============================================
   DIALOG COMPONENT
   ============================================ */

interface DialogContextType {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

export interface DialogProps {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export const Dialog: React.FC<DialogProps> = ({ children, open = false, onOpenChange }) => {
    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange?.(newOpen)
    }

    return (
        <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
            {children}
        </DialogContext.Provider>
    )
}

export const DialogTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children, asChild }) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error('DialogTrigger must be used within a Dialog')
    const { onOpenChange } = context

    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
        return React.cloneElement(child, {
            onClick: (e: React.MouseEvent) => {
                child.props.onClick?.(e)
                onOpenChange(true)
            }
        })
    }

    return (
        <button onClick={() => onOpenChange(true)}>
            {children}
        </button>
    )
}

export interface DialogContentProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
}

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export const DialogContent: React.FC<DialogContentProps> = ({ className, children, ...props }) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error('DialogContent must be used within a Dialog')

    const { open, onOpenChange } = context
    const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={() => onOpenChange(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={cn(
                                'relative w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-2xl pointer-events-auto',
                                'max-h-[90vh] overflow-y-auto',
                                className
                            )}
                            {...props}
                        >
                            <div className="absolute right-4 top-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-full"
                                    onClick={() => onOpenChange(false)}
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            </div>
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={cn('flex flex-col space-y-1.5 p-6 pb-4 text-center sm:text-left', className)} {...props} />
)

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-2', className)} {...props} />
)

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
)

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
    <p className={cn('text-sm text-[var(--color-muted-foreground)]', className)} {...props} />
)
