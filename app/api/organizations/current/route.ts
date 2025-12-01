// API Route: /api/organizations/current - Get current organization
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/organizations/current
 * Obtiene la organización activa actual del usuario
 */
export async function GET() {
    try {
        // Verificar autenticación
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        // Obtener de la cookie
        const cookieStore = await cookies()
        const currentOrgId = cookieStore.get('current-organization')?.value

        if (!currentOrgId) {
            return NextResponse.json({ organizationId: null })
        }

        return NextResponse.json({
            organizationId: currentOrgId,
        })
    } catch (error) {
        console.error('Error getting current organization:', error)
        return NextResponse.json(
            { error: 'Error al obtener organización actual' },
            { status: 500 }
        )
    }
}
