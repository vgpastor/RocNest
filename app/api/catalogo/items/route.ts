import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreateItemUseCase } from '@/app/catalogo/application/use-cases/CreateItemUseCase'
import { SupabaseItemRepository } from '@/app/catalogo/infrastructure/repositories/SupabaseItemRepository'
import { SupabaseCategoryRepository } from '@/app/catalogo/infrastructure/repositories/SupabaseCategoryRepository'
import { SupabaseStorageService } from '@/app/catalogo/infrastructure/services/SupabaseStorageService'
import { MetadataValidatorService } from '@/app/catalogo/infrastructure/services/MetadataValidatorService'
import { ItemStatus } from '@/app/catalogo/domain/value-objects/ItemStatus'

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

        const formData = await request.formData()

        const categoryId = formData.get('categoryId') as string
        const name = formData.get('name') as string
        const brand = formData.get('brand') as string
        const model = formData.get('model') as string
        const status = formData.get('status') as ItemStatus
        const description = formData.get('description') as string
        const identifierBase = formData.get('identifierBase') as string
        const quantity = parseInt(formData.get('quantity') as string)
        const hasUniqueNumbering = formData.get('hasUniqueNumbering') === 'on'
        const metadataJson = formData.get('metadata') as string
        const imageFile = formData.get('image') as File | null

        let metadata = {}
        try {
            metadata = JSON.parse(metadataJson)
        } catch (e) {
            return NextResponse.json({ success: false, error: 'Metadata inválida' }, { status: 400 })
        }

        // Instantiate dependencies
        const itemRepository = new SupabaseItemRepository(supabase)
        const categoryRepository = new SupabaseCategoryRepository(supabase)
        const storageService = new SupabaseStorageService()
        const metadataValidator = new MetadataValidatorService(categoryRepository)

        const createItemUseCase = new CreateItemUseCase(
            itemRepository,
            categoryRepository,
            storageService,
            metadataValidator,
            async () => user.id
        )

        const result = await createItemUseCase.execute({
            name,
            description,
            brand,
            model,
            categoryId,
            identifierBase,
            hasUniqueNumbering,
            quantity,
            status,
            metadata,
            imageFile: imageFile || undefined
        })

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 })
        }

        return NextResponse.json({ success: true, items: result.items })
    } catch (error) {
        console.error('Error in API route:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
