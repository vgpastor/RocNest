'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
    LayoutDashboard,
    Package,
    Calendar,
    Settings,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    List,
    ClipboardCheck,
    ClipboardList
} from 'lucide-react'
import { cn, Logo } from '@/components'

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isCollapsed: boolean
    setIsCollapsed: (collapsed: boolean) => void
}

interface MenuItem {
    href?: string
    label: string
    icon: any
    subItems?: { href: string; label: string; icon?: any }[]
}

export function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname()
    const [expandedMenus, setExpandedMenus] = useState<string[]>([])

    // Auto-expand menu if child is active
    useEffect(() => {
        menuItems.forEach(item => {
            if (item.subItems) {
                const isChildActive = item.subItems.some(sub => pathname === sub.href)
                if (isChildActive && !expandedMenus.includes(item.label)) {
                    setExpandedMenus(prev => [...prev, item.label])
                }
            }
        })
    }, [pathname])

    const toggleMenu = (label: string) => {
        if (isCollapsed) setIsCollapsed(false)
        setExpandedMenus(prev =>
            prev.includes(label)
                ? prev.filter(l => l !== label)
                : [...prev, label]
        )
    }

    const menuItems: MenuItem[] = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        {
            label: 'Catálogo',
            icon: Package,
            subItems: [
                { href: '/catalog', label: 'Productos', icon: Package },
                { href: '/catalog/categories', label: 'Categorías', icon: List },
                { href: '/catalog/reviews', label: 'Revisiones', icon: ClipboardCheck },
                { href: '/catalog/configuration/checklists', label: 'Checklists', icon: ClipboardList }
            ]
        },
        { href: '/reservations', label: 'Reservas', icon: Calendar },
        { href: '/configuration', label: 'Configuración', icon: Settings },
    ]

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--color-border)] glass transition-all duration-300 ease-in-out lg:static",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    isCollapsed ? "lg:w-[70px]" : "lg:w-64",
                    "w-64"
                )}
            >
                {/* Header / Logo */}
                <div className={cn(
                    "flex h-16 items-center border-b border-[var(--color-border)] px-4",
                    isCollapsed ? "lg:justify-center" : "justify-between"
                )}>
                    <Link href="/" className="flex items-center gap-2 overflow-hidden">
                        <Logo
                            size={isCollapsed ? 32 : 32}
                            showText={!isCollapsed}
                            className="shrink-0"
                        />
                    </Link>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-1 hover:bg-[var(--color-accent)] rounded-md transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isExpanded = expandedMenus.includes(item.label)
                            const hasSubItems = item.subItems && item.subItems.length > 0
                            const isActive = item.href === pathname || (hasSubItems && item.subItems?.some(sub => sub.href === pathname))

                            return (
                                <li key={item.label}>
                                    {hasSubItems ? (
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => toggleMenu(item.label)}
                                                title={isCollapsed ? item.label : undefined}
                                                className={cn(
                                                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                    isActive
                                                        ? "text-[var(--color-primary)] bg-[var(--color-accent)]/50"
                                                        : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]",
                                                    isCollapsed && "lg:justify-center lg:px-2"
                                                )}
                                            >
                                                <Icon className="h-5 w-5 shrink-0" />
                                                <span className={cn(
                                                    "flex-1 text-left whitespace-nowrap transition-all duration-300",
                                                    isCollapsed ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"
                                                )}>
                                                    {item.label}
                                                </span>
                                                {!isCollapsed && (
                                                    <ChevronDown
                                                        className={cn(
                                                            "h-4 w-4 transition-transform duration-200",
                                                            isExpanded ? "rotate-180" : ""
                                                        )}
                                                    />
                                                )}
                                            </button>

                                            {/* Submenu */}
                                            <div
                                                className={cn(
                                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                                    isExpanded && !isCollapsed ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                                                )}
                                            >
                                                <ul className="pl-10 space-y-1">
                                                    {item.subItems?.map((sub) => {
                                                        const isSubActive = pathname === sub.href
                                                        return (
                                                            <li key={sub.href}>
                                                                <Link
                                                                    href={sub.href}
                                                                    className={cn(
                                                                        "block rounded-md px-3 py-2 text-sm transition-colors",
                                                                        isSubActive
                                                                            ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-medium"
                                                                            : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-accent)]"
                                                                    )}
                                                                >
                                                                    {sub.label}
                                                                </Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href!}
                                            title={isCollapsed ? item.label : undefined}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
                                                    : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]",
                                                isCollapsed && "lg:justify-center lg:px-2"
                                            )}
                                        >
                                            <Icon className="h-5 w-5 shrink-0" />
                                            <span className={cn(
                                                "whitespace-nowrap transition-all duration-300",
                                                isCollapsed ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"
                                            )}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer / Collapse Toggle */}
                <div className="border-t border-[var(--color-border)] p-4 hidden lg:flex lg:justify-end">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-accent)] transition-colors"
                        title={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </aside>
        </>
    )
}
