export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    phone: string | null
                    role: 'admin' | 'user'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'admin' | 'user'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'admin' | 'user'
                    created_at?: string
                    updated_at?: string
                }
            }
            items: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    category: string
                    status: 'available' | 'rented' | 'maintenance' | 'lost'
                    image_url: string | null
                    identifier: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    category: string
                    status?: 'available' | 'rented' | 'maintenance' | 'lost'
                    image_url?: string | null
                    identifier?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    category?: string
                    status?: 'available' | 'rented' | 'maintenance' | 'lost'
                    image_url?: string | null
                    identifier?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            reservations: {
                Row: {
                    id: string
                    user_id: string
                    start_date: string
                    end_date: string
                    location: string | null
                    purpose: string | null
                    status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled' | 'rejected'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    start_date: string
                    end_date: string
                    location?: string | null
                    purpose?: string | null
                    status?: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    start_date?: string
                    end_date?: string
                    location?: string | null
                    purpose?: string | null
                    status?: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
            }
            reservation_items: {
                Row: {
                    id: string
                    reservation_id: string
                    item_id: string
                    checked_out: boolean
                    checked_in: boolean
                    condition_on_return: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    reservation_id: string
                    item_id: string
                    checked_out?: boolean
                    checked_in?: boolean
                    condition_on_return?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    reservation_id?: string
                    item_id?: string
                    checked_out?: boolean
                    checked_in?: boolean
                    condition_on_return?: string | null
                    created_at?: string
                }
            }
            incidents: {
                Row: {
                    id: string
                    item_id: string
                    reservation_id: string | null
                    description: string
                    severity: 'low' | 'medium' | 'high'
                    reported_at: string
                    resolved: boolean
                }
                Insert: {
                    id?: string
                    item_id: string
                    reservation_id?: string | null
                    description: string
                    severity?: 'low' | 'medium' | 'high'
                    reported_at?: string
                    resolved?: boolean
                }
                Update: {
                    id?: string
                    item_id?: string
                    reservation_id?: string | null
                    description?: string
                    severity?: 'low' | 'medium' | 'high'
                    reported_at?: string
                    resolved?: boolean
                }
            }
        }
    }
}
