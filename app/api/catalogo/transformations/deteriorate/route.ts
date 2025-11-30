import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DeteriorateItemUseCase } from '@/app/catalogo/application/use-cases/DeteriorateItemUseCase'
import { SupabaseItemRepository } from '@/app/catalogo/infrastructure/repositories/SupabaseItemRepository'
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
        const itemRepository = new SupabaseItemRepository()
        const transformationRepository = new SupabaseTransformationRepository()

        const deteriorateItemUseCase = new DeteriorateItemUseCase(
            itemRepository,
            transformationRepository,
            async () => user.id
        )

        const result = await deteriorateItemUseCase.execute({
            itemId: body.itemId,
            originalValue: body.originalValue,
            damagedValue: body.damagedValue,
            remainingValue: body.remainingValue,
            damageLocation: body.damageLocation,
            damageReason: body.damageReason,
            unit: body.unit,
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
