import { createClient } from '@/lib/supabase/server'
import { SupabaseCategoryRepository } from '../infrastructure/repositories/SupabaseCategoryRepository'

export default async function TestPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    let profile = null
    if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        profile = data
    }

    const categoryRepo = new SupabaseCategoryRepository(supabase)
    let categories = []
    let items = []
    let error = null

    try {
        categories = await categoryRepo.findAll()
        const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false })
        items = data || []
    } catch (e) {
        error = e
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Catalog Test Page</h1>
            <div className="mb-4">
                <h2 className="font-semibold">User:</h2>
                <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(user, null, 2)}</pre>
                <h2 className="font-semibold mt-2">Profile:</h2>
                <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(profile, null, 2)}</pre>
            </div>

            <div className="mb-8">
                <h2 className="font-semibold text-xl mb-2">Items ({items.length}):</h2>
                {items.length > 0 ? (
                    <div className="grid gap-4">
                        {items.map((item: any) => (
                            <div key={item.id} className="border p-4 rounded bg-white shadow-sm">
                                <div className="font-bold">{item.name}</div>
                                <div className="text-sm text-gray-500">ID: {item.id}</div>
                                <div className="text-sm">Status: {item.status}</div>
                                <div className="text-sm">Category ID: {item.category_id}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-yellow-600">No items found</div>
                )}
            </div>

            <div className="mb-4">
                <h2 className="font-semibold text-xl mb-2">Categories ({categories?.length ?? 'null'}):</h2>
                {error ? (
                    <div className="text-red-500">Error: {JSON.stringify(error)}</div>
                ) : (
                    categories && categories.length > 0 ? (
                        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96">{JSON.stringify(categories, null, 2)}</pre>
                    ) : (
                        <div className="text-yellow-600">No categories found (Empty Array)</div>
                    )
                )}
            </div>
        </div>
    )
}
