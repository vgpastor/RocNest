import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { SupabaseItemRepository } from '../infrastructure/repositories/SupabaseItemRepository'
import { SupabaseCategoryRepository } from '../infrastructure/repositories/SupabaseCategoryRepository'
import { SupabaseTransformationRepository } from '../infrastructure/repositories/SupabaseTransformationRepository'
import ItemDetailClient from './ItemDetailClient'

export default async function ItemDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    // Fetch item details
    const itemRepo = new SupabaseItemRepository(supabase)
    const categoryRepo = new SupabaseCategoryRepository(supabase)
    const transformationRepo = new SupabaseTransformationRepository(supabase)

    const item = await itemRepo.findById(id)
    if (!item) notFound()

    const category = await categoryRepo.findById(item.categoryId)
    const transformations = await transformationRepo.findByItemId(item.id)

    return (
        <ItemDetailClient
            item={item}
            category={category}
            transformations={transformations}
            isAdmin={isAdmin}
        />
    )
}
