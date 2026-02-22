'use client'

import { Loader2, Mail, Lock, AlertCircle, CheckCircle2, Users, Package, Calendar, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Logo } from '@/components'

import { StructuredData } from './components/StructuredData'

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
                credentials: 'include',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión')
            }

            setTimeout(() => {
                router.push('/')
                router.refresh()
            }, 100)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <>
            <StructuredData />
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left Panel - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-[var(--color-background)] order-2 lg:order-1">
                    <div className="w-full max-w-md space-y-6 sm:space-y-8">
                        {/* Logo */}
                        <div className="text-center space-y-4">
                            <div className="flex justify-center mb-4">
                                <Logo size={64} />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bienvenido de nuevo</h1>
                            <p className="text-sm sm:text-base text-[var(--color-muted-foreground)]">
                                Accede a tu panel de gestión
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
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-foreground)]" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="nombre@ejemplo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
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
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-foreground)]" />
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-destructive-bg)] text-[var(--color-destructive)] text-sm">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-primary-foreground)] font-medium rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                                    <div className="w-full border-t border-[var(--color-border)]"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-[var(--color-background)] text-[var(--color-muted-foreground)]">
                                        ¿No tienes cuenta?
                                    </span>
                                </div>
                            </div>
                            <Link
                                href="/register"
                                className="inline-block w-full py-3 px-4 border border-[var(--color-input)] hover:bg-[var(--color-accent)] rounded-lg font-medium transition-all duration-200"
                            >
                                Crear cuenta gratis
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Hero */}
                <div className="w-full lg:w-1/2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden order-1 lg:order-2 min-h-[40vh] lg:min-h-screen">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 bg-grid-white/10"></div>
                    <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 text-white space-y-6 max-w-lg">
                        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                            Gestiona el Material de tu Club Deportivo Sin Complicaciones
                        </h2>
                        <p className="text-base sm:text-lg text-white/90">
                            Controla inventario, reservas y préstamos en un solo lugar. Gratis para siempre.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                                <Package className="h-6 w-6 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Control Total</h3>
                                    <p className="text-sm text-white/80">Inventario completo de tu material</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                                <Calendar className="h-6 w-6 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Reservas Fáciles</h3>
                                    <p className="text-sm text-white/80">Sistema ágil de préstamos</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                                <Users className="h-6 w-6 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Multi-Organización</h3>
                                    <p className="text-sm text-white/80">Gestiona varios clubes</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                                <Shield className="h-6 w-6 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">100% Seguro</h3>
                                    <p className="text-sm text-white/80">Tus datos protegidos</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Info */}
                        <div className="pt-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="text-sm">Para clubes de montaña, escalada, running y más</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="text-sm">Crea tu cuenta y organización en 2 minutos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="text-sm">Sin tarjeta de crédito, gratis para siempre</span>
                            </div>
                        </div>

                        {/* RocStatus Badge */}
                        <div className="pt-6 border-t border-white/20">
                            <a
                                href="https://rocstatus.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors"
                            >
                                Un proyecto de <span className="font-semibold text-white/80">RocStatus.com</span> &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
