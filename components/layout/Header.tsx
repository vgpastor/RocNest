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
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/60">
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
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 p-1.5 rounded-lg">
                            <div className="h-8 w-8 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center">
                                <User className="h-4 w-4 text-[var(--color-primary)]" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium leading-none">{user.fullName || 'Usuario'}</p>
                                <p className="text-xs text-[var(--color-muted-foreground)] truncate max-w-[150px]">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-[var(--color-destructive-bg)] hover:text-[var(--color-destructive)] rounded-full transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
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
