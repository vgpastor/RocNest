import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SimpleCatalogPage() {
    try {
        // Step 1: Create client
        const supabase = await createClient()
        console.log('✓ Created Supabase client')

        // Step 2: Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw new Error(`User error: ${userError.message}`)
        if (!user) redirect('/login')
        console.log('✓ Got user:', user.id)

        // Step 3: Get profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profileError) throw new Error(`Profile error: ${profileError.message}`)
        console.log('✓ Got profile:', profile)

        // Step 4: Get categories
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*')
            .order('name')

        if (catError) throw new Error(`Categories error: ${catError.message}`)
        console.log('✓ Got categories:', categories?.length || 0)

        // Step 5: Get items
        const { data: items, error: itemsError } = await supabase
            .from('items')
            .select(`
                *,
                category:categories(name, slug, icon)
            `)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })

        if (itemsError) throw new Error(`Items error: ${itemsError.message}`)
        console.log('✓ Got items:', items?.length || 0)

        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Simple Catalog Test (Success!)</h1>
                <div className="space-y-4">
                    <div className="bg-green-100 p-4 rounded">
                        <p>✓ User: {user.email}</p>
                        <p>✓ Role: {profile?.role}</p>
                        <p>✓ Categories: {categories?.length || 0}</p>
                        <p>✓ Items: {items?.length || 0}</p>
                    </div>
                    <div>
                        <h2 className="font-bold">Categories:</h2>
                        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60 text-xs">
                            {JSON.stringify(categories, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <h2 className="font-bold">Items (first 3):</h2>
                        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60 text-xs">
                            {JSON.stringify(items?.slice(0, 3), null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.log('❌ Error:', error)
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
                <div className="bg-red-100 p-4 rounded">
                    <pre className="whitespace-pre-wrap">
                        {error instanceof Error ? error.message : String(error)}
                        {'\n\n'}
                        {error instanceof Error && error.stack}
                    </pre>
                </div>
            </div>
        )
    }
}
