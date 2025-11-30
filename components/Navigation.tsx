'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mountain, Package, CalendarDays, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Navigation() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navItems = [
        { href: '/', label: 'Inicio', icon: Mountain },
        { href: '/catalogo', label: 'Catálogo', icon: Package },
        { href: '/reservas', label: 'Mis Reservas', icon: CalendarDays },
        { href: '/admin', label: 'Admin', icon: Settings },
    ]

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-violet-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                                <Mountain className="h-7 w-7 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
                                Gear Hub
                            </span>
                            <span className="text-xs text-gray-500 font-medium">Material de Montaña</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                                        isActive
                                            ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white shadow-lg shadow-sky-500/30'
                                            : 'text-gray-700 hover:text-sky-600 hover:bg-gray-100'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            )
                        })}
                        <div className="ml-2 h-8 w-px bg-gray-300"></div>
                        <button className="ml-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all duration-200">
                            <LogOut className="h-4 w-4" />
                            Salir
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6 text-gray-700" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 animate-fade-in">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                                            isActive
                                                ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                            <div className="my-2 h-px bg-gray-200"></div>
                            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all duration-200">
                                <LogOut className="h-5 w-5" />
                                Salir
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
