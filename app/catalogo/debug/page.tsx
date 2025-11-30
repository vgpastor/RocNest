export default function DebugPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
            <div className="space-y-4">
                <div>
                    <h2 className="font-semibold">Supabase URL:</h2>
                    <p className="bg-gray-100 p-2 rounded font-mono text-sm">
                        {supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ NOT SET'}
                    </p>
                </div>
                <div>
                    <h2 className="font-semibold">Supabase Anon Key:</h2>
                    <p className="bg-gray-100 p-2 rounded font-mono text-sm">
                        {supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : '❌ NOT SET'}
                    </p>
                </div>
                <div>
                    <h2 className="font-semibold">Environment:</h2>
                    <p className="bg-gray-100 p-2 rounded font-mono text-sm">
                        {process.env.NODE_ENV}
                    </p>
                </div>
            </div>
        </div>
    )
}
