'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mountain, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión')
            }

            router.push('/')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-primary via-violet-600 to-purple-600 items-center justify-center shadow-lg shadow-primary/30 mb-4">
                            <Mountain className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h1>
                        <p className="text-muted-foreground">
                            Inicia sesión para gestionar tu inventario
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="nombre@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-medium rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="text-center space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-background text-muted-foreground">
                                    ¿No tienes cuenta?
                                </span>
                            </div>
                        </div>
                        <Link
                            href="/register"
                            className="inline-block w-full py-3 px-4 border border-input hover:bg-accent rounded-lg font-medium transition-all duration-200"
                        >
                            Crear una cuenta
                        </Link>
                    </div>

                    {/* Dev Note */}
                    <p className="text-xs text-center text-muted-foreground">
                        Para desarrollo: Contraseña de usuarios seeded es <code className="px-1.5 py-0.5 bg-secondary rounded text-foreground font-mono">12341234</code>
                    </p>
                </div>
            </div>

            {/* Right Panel - Hero */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-violet-600 to-purple-600 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10 text-white space-y-6 max-w-lg">
                    <h2 className="text-4xl font-bold leading-tight">
                        Gestiona tu inventario de forma eficiente
                    </h2>
                    <p className="text-lg text-white/90">
                        Sistema completo de gestión de reservas y material para organizaciones deportivas y de montaña.
                    </p>
                    <ul className="space-y-3 text-white/90">
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                            <span>Control total de tu inventario</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                            <span>Gestión de reservas simplificada</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                            <span>Multi-organización</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
