// Infrastructure Layer - Supabase Category Repository

import { SupabaseClient } from '@supabase/supabase-js'
import { Category } from '../../domain/entities/Category'
import { ICategoryRepository } from '../../application/use-cases/CreateItemUseCase'

export class SupabaseCategoryRepository implements ICategoryRepository {
    constructor(private supabase: SupabaseClient) { }

    async findById(id: string): Promise<Category | null> {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null // Not found
            throw error
        }

        return data ? this.mapToEntity(data) : null
    }

    async findAll(): Promise<Category[]> {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .order('name')

        if (error) throw error

        return data.map(d => this.mapToEntity(d))
    }

    async findBySlug(slug: string): Promise<Category | null> {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }

        return data ? this.mapToEntity(data) : null
    }

    private mapToEntity(data: any): Category {
        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            requiresUniqueNumbering: data.requires_unique_numbering,
            canBeComposite: data.can_be_composite,
            canBeSubdivided: data.can_be_subdivided,
            metadataSchema: data.metadata_schema || {},
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
        }
    }
}
