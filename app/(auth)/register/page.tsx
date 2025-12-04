'use client'

import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Logo } from '@/components'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la cuenta')
            }

            router.push('/')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Password strength indicator
    const getPasswordStrength = () => {
        if (password.length === 0) return null
        if (password.length < 8) return { label: 'Débil', color: 'bg-[var(--color-destructive)]', width: '33%' }
        if (password.length < 12) return { label: 'Media', color: 'bg-[var(--color-warning)]', width: '66%' }
        return { label: 'Fuerte', color: 'bg-[var(--color-success)]', width: '100%' }
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10 text-white space-y-6 max-w-lg">
                    <h2 className="text-4xl font-bold leading-tight">
                        Únete a cientos de organizaciones
                    </h2>
                    <p className="text-lg text-white/90">
                        Comienza a gestionar tu inventario de forma profesional. Crea tu cuenta en segundos.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                            <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Fácil de usar</h3>
                            <p className="text-sm text-white/80">Interfaz intuitiva y moderna</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">100% Seguro</h3>
                            <p className="text-sm text-white/80">Tus datos protegidos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--color-background)]">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center mb-4">
                            <Logo size={64} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
                        <p className="text-[var(--color-muted-foreground)]">
                            Completa el formulario para comenzar
                        </p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-4">
                            {/* Full Name Input */}
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-medium">
                                    Nombre completo
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-foreground)]" />
                                    <input
                                        id="fullName"
                                        type="text"
                                        placeholder="Juan Pérez"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

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
                                        placeholder="Mínimo 8 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {/* Password Strength Indicator */}
                                {passwordStrength && (
                                    <div className="space-y-1">
                                        <div className="h-1 w-full bg-[var(--color-muted)] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                style={{ width: passwordStrength.width }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-[var(--color-muted-foreground)]">
                                            Seguridad: {passwordStrength.label}
                                        </p>
                                    </div>
                                )}
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
                                    Creando cuenta...
                                </>
                            ) : (
                                'Crear cuenta'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-[var(--color-muted-foreground)]">
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
