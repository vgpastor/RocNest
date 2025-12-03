'use client'

import { Menu, Bell, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { OrganizationSelector } from '../OrganizationSelector'
import { OrganizationBadge } from '../OrganizationBadge'
import { SearchBar } from '@/components'
import type { AuthUser } from '@/lib/auth/types'

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void
}

export function Header({ setSidebarOpen }: HeaderProps) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch('/api/auth/me')
                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                }
            } catch (error) {
                console.error('Failed to fetch user:', error)
            }
        }
        getUser()
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <header className="sticky top-4 z-30 flex h-16 items-center gap-4 rounded-xl border border-[var(--color-border)] glass mx-4 sm:mx-6 lg:mx-8 mb-6">
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden -ml-2 p-2 hover:bg-[var(--color-accent)] rounded-md transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="flex flex-1 items-center gap-4">
                {/* Organization Badge (desktop) */}
                <OrganizationBadge />

                <div className="w-full max-w-md hidden sm:block">
                    <SearchBar placeholder="Buscar material, reservas..." />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Organization Selector */}
                <div className="hidden md:block">
                    <OrganizationSelector />
                </div>

                <button className="relative p-2 hover:bg-[var(--color-accent)] rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-destructive)] border-2 border-[var(--color-background)]" />
                </button>

                <div className="h-8 w-px bg-[var(--color-border)] mx-1" />

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[var(--color-accent)] transition-colors text-left"
                        >
                            <div className="h-8 w-8 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center border border-[var(--color-primary)]/20">
                                <User className="h-4 w-4 text-[var(--color-primary)]" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium leading-none text-[var(--color-foreground)]">
                                    {user.fullName || 'Usuario'}
                                </p>
                                <p className="text-xs text-[var(--color-muted-foreground)] truncate max-w-[150px]">
                                    {user.email}
                                </p>
                            </div>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-2 py-1.5 border-b border-[var(--color-border)] mb-1 md:hidden">
                                        <p className="text-sm font-medium leading-none">{user.fullName || 'Usuario'}</p>
                                        <p className="text-xs text-[var(--color-muted-foreground)] truncate">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--color-destructive)] hover:bg-[var(--color-destructive-bg)] rounded-lg transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Cerrar sesión
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => router.push('/login')}
                        className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                )}
            </div>
        </header>
    )
}
