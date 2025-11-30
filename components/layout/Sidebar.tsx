'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    Calendar,
    Settings,
    X,
    Mountain,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isCollapsed: boolean
    setIsCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname()

    const menuItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/catalogo', label: 'Catálogo', icon: Package },
        { href: '/reservas', label: 'Reservas', icon: Calendar },
        { href: '/admin', label: 'Configuración', icon: Settings },
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
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 ease-in-out lg:static",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    isCollapsed ? "lg:w-[70px]" : "lg:w-64",
                    "w-64"
                )}
            >
                {/* Header / Logo */}
                <div className={cn(
                    "flex h-16 items-center border-b px-4",
                    isCollapsed ? "lg:justify-center" : "justify-between"
                )}>
                    <Link href="/" className="flex items-center gap-2 overflow-hidden">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Mountain className="h-5 w-5" />
                        </div>
                        <span className={cn(
                            "font-bold text-lg whitespace-nowrap transition-all duration-300",
                            isCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100 w-auto"
                        )}>
                            Gear Hub
                        </span>
                    </Link>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-1 hover:bg-accent rounded-md"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        title={isCollapsed ? item.label : undefined}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer / Collapse Toggle */}
                <div className="border-t p-4 hidden lg:flex lg:justify-end">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground"
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
