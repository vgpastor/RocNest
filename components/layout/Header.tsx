'use client'

import { Menu, Search, Bell, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void
}

export function Header({ setSidebarOpen }: HeaderProps) {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden -ml-2 p-2 hover:bg-accent rounded-md"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="flex flex-1 items-center gap-4">
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Buscar..."
                        className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
                </button>

                <div className="h-8 w-px bg-border mx-1" />

                {user ? (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 p-1.5 rounded-lg">
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                <User className="h-4 w-4" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium leading-none">Usuario</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => router.push('/login')}
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                )}
            </div>
        </header>
    )
}
