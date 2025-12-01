// API Route: /api/organizations/switch - Migrado a Prisma
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/organizations/switch
 * Cambia la organización activa del usuario
 */
export async function POST(request: Request) {
    try {
        // Verificar autenticación
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const body = await request.json()
        const { organizationId } = body

        if (!organizationId) {
            return NextResponse.json(
                { error: 'organizationId es requerido' },
                { status: 400 }
            )
        }

        // Verificar que el usuario pertenece a la organización
        const userOrg = await prisma.userOrganization.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.id,
                    organizationId
                }
            }
        })

        if (!userOrg) {
            return NextResponse.json(
                { error: 'No perteneces a esta organización' },
                { status: 403 }
            )
        }

        // Guardar en cookie
        const cookieStore = await cookies()
        cookieStore.set('current-organization', organizationId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 días
        })

        return NextResponse.json({
            success: true,
            organizationId
        })
    } catch (error) {
        console.error('Error switching organization:', error)
        return NextResponse.json(
            { error: 'Error al cambiar organización' },
            { status: 500 }
        )
    }
}

/**
 * GET /api/organizations/current
 * Obtiene la organización activa actual
 */
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

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
