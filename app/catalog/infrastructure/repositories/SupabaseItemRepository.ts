// Infrastructure Layer - Supabase Item Repository

import { SupabaseClient } from '@supabase/supabase-js'
import { Item } from '../../domain/entities/Item'
import { IItemRepository } from '../../application/use-cases/CreateItemUseCase'

export class SupabaseItemRepository implements IItemRepository {
    constructor(private supabase: SupabaseClient) { }
    async create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
        const { data, error } = await this.supabase
            .from('items')
            .insert({
                name: item.name,
                description: item.description,
                brand: item.brand,
                model: item.model,
                category_id: item.categoryId,
                status: item.status,
                image_url: item.imageUrl,
                identifier: item.identifier,
                has_unique_numbering: item.hasUniqueNumbering,
                is_composite: item.isComposite,
                metadata: item.metadata,
                origin_transformation_id: item.originTransformationId,
                deleted_at: item.deletedAt,
                deletion_reason: item.deletionReason
            })
            .select()
            .single()

        if (error) throw error
        if (!data) throw new Error('Failed to create item')

        return this.mapToEntity(data)
    }

    async findById(id: string): Promise<Item | null> {
        const { data, error } = await this.supabase
            .from('items')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null // Not found
            throw error
        }

        return data ? this.mapToEntity(data) : null
    }

    async findByIdentifier(identifier: string): Promise<Item | null> {
        const { data, error } = await this.supabase
            .from('items')
            .select('*')
            .eq('identifier', identifier)
            .is('deleted_at', null)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null // Not found
            throw error
        }

        return data ? this.mapToEntity(data) : null
    }

    async update(id: string, updates: Partial<Item>): Promise<Item> {
        const updateData: any = {}
        if (updates.name !== undefined) updateData.name = updates.name
        if (updates.description !== undefined) updateData.description = updates.description
        if (updates.status !== undefined) updateData.status = updates.status
        if (updates.metadata !== undefined) updateData.metadata = updates.metadata
        if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl
        if (updates.isComposite !== undefined) updateData.is_composite = updates.isComposite

        const { data, error } = await this.supabase
            .from('items')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        if (!data) throw new Error('Failed to update item')

        return this.mapToEntity(data)
    }

    private mapToEntity(data: any): Item {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            brand: data.brand,
            model: data.model,
            categoryId: data.category_id,
            status: data.status,
            imageUrl: data.image_url,
            identifier: data.identifier,
            hasUniqueNumbering: data.has_unique_numbering,
            isComposite: data.is_composite,
            metadata: data.metadata || {},
            originTransformationId: data.origin_transformation_id,
            deletedAt: data.deleted_at ? new Date(data.deleted_at) : null,
            deletionReason: data.deletion_reason,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
        }
    }
}
