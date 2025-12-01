import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SupabaseCategoryRepository } from '../infrastructure/repositories/SupabaseCategoryRepository'
import NewItemForm from './NewItemForm'

export default async function NewItemPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/catalogo')
    }

    // Fetch categories
    const categoryRepo = new SupabaseCategoryRepository(supabase)
    const categoriesList = await categoryRepo.findAll()

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Agregar Nuevo Material</h1>
            <NewItemForm categories={JSON.parse(JSON.stringify(categoriesList))} />
        </div>
    )
}
