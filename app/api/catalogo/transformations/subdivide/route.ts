import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SubdivideItemUseCase } from '@/app/catalogo/application/use-cases/SubdivideItemUseCase'
import { SupabaseItemRepository } from '@/app/catalogo/infrastructure/repositories/SupabaseItemRepository'
import { SupabaseCategoryRepository } from '@/app/catalogo/infrastructure/repositories/SupabaseCategoryRepository'
import { SupabaseTransformationRepository } from '@/app/catalogo/infrastructure/repositories/SupabaseTransformationRepository'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
        }

        // Check admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
        }

        const body = await request.json()

        // Instantiate dependencies
        const itemRepository = new SupabaseItemRepository(supabase)
        const categoryRepository = new SupabaseCategoryRepository(supabase)
        const transformationRepository = new SupabaseTransformationRepository(supabase)

        const subdivideItemUseCase = new SubdivideItemUseCase(
            itemRepository,
            categoryRepository,
            transformationRepository,
            async () => user.id
        )

        const result = await subdivideItemUseCase.execute({
            sourceItemId: body.sourceItemId,
            subdivisions: body.subdivisions,
            unit: body.unit,
            reason: body.reason,
            notes: body.notes
        })

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 })
        }

        return NextResponse.json({ success: true, transformation: result.transformation })
    } catch (error) {
        console.error('Error in API route:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
