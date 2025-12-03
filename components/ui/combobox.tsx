'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronsUpDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
    value: string
    label: string
}

export interface ComboboxProps {
    options: ComboboxOption[]
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    label?: string
    error?: string
    className?: string
    disabled?: boolean
    onSearchChange?: (value: string) => void
    isLoading?: boolean
    shouldFilter?: boolean
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    label,
    error,
    className,
    disabled = false,
    onSearchChange,
    isLoading = false,
    shouldFilter = true
}: ComboboxProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        if (!shouldFilter) return options
        if (!searchTerm) return options
        const lowerTerm = searchTerm.toLowerCase()
        return options.filter(option =>
            option.label.toLowerCase().includes(lowerTerm)
        )
    }, [options, searchTerm, shouldFilter])

    // Find selected option label
    const selectedOption = options.find(opt => opt.value === value)

    const handleSelect = (optionValue: string) => {
        onChange(optionValue)
        setIsOpen(false)
        setSearchTerm('')
        if (onSearchChange) onSearchChange('')
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange('')
        setSearchTerm('')
        if (onSearchChange) onSearchChange('')
    }

    return (
        <div className={cn("flex flex-col gap-2 group", className)} ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-[var(--color-foreground)] group-focus-within:text-[var(--color-primary)] transition-colors">
                    {label}
                </label>
            )}

            <div className="relative">
                <div
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm ring-offset-[var(--color-background)] cursor-pointer",
                        "text-[var(--color-foreground)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2",
                        "transition-all duration-200",
                        disabled && "cursor-not-allowed opacity-50",
                        error && "border-[var(--color-destructive)]",
                        isOpen && "ring-2 ring-[var(--color-ring)] ring-offset-2 border-[var(--color-primary)]"
                    )}
                >
                    <span className={cn("block truncate", !selectedOption && "text-[var(--color-muted-foreground)]")}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="flex items-center gap-1">
                        {selectedOption && !disabled && (
                            <div
                                onClick={handleClear}
                                className="p-0.5 rounded-full hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </div>
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-background)] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                            <div className="sticky top-0 z-10 bg-[var(--color-background)] px-2 py-1.5 border-b border-[var(--color-border)]">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="w-full rounded-sm bg-[var(--color-muted)]/50 py-1 pl-7 pr-2 text-xs leading-5 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:bg-[var(--color-muted)] focus:outline-none"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                            if (onSearchChange) onSearchChange(e.target.value)
                                        }}
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-[var(--color-muted-foreground)] text-center">
                                    <span className="animate-pulse">Cargando...</span>
                                </div>
                            ) : filteredOptions.length === 0 ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-[var(--color-muted-foreground)]">
                                    No se encontraron resultados.
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            "relative cursor-pointer select-none py-2 pl-3 pr-9 text-[var(--color-foreground)] hover:bg-[var(--color-accent)] transition-colors",
                                            value === option.value && "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                                        )}
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        <span className={cn("block truncate", value === option.value && "font-semibold")}>
                                            {option.label}
                                        </span>
                                        {value === option.value && (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--color-primary)]">
                                                <Check className="h-4 w-4" />
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && (
                <p className="text-sm text-[var(--color-destructive)]">
                    {error}
                </p>
            )}
        </div>
    )
}
