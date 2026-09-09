'use client'

// Design System - Molecule
// Replaces window.confirm() so destructive actions stay inside the design system.

import * as React from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog'

import { Button } from './index'

export interface ConfirmDialogProps {
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'default' | 'destructive'
    onConfirm: () => void
    onOpenChange: (open: boolean) => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'default',
    onConfirm,
    onOpenChange,
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    {cancelLabel}
                </Button>
                <Button
                    variant={variant === 'destructive' ? 'destructive' : 'primary'}
                    onClick={() => {
                        onConfirm()
                        onOpenChange(false)
                    }}
                >
                    {confirmLabel}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
