// Infrastructure Layer - Supabase Item Component Repository

import { createClient } from '@/lib/supabase/server'
import { ItemComponent } from '../../domain/entities/Item'
import { IItemComponentRepository } from '../../application/use-cases/CreateCompositeItemUseCase'

export class SupabaseItemComponentRepository implements IItemComponentRepository {
    async create(component: Omit<ItemComponent, 'id' | 'createdAt'>): Promise<ItemComponent> {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('item_components')
            .insert({
                parent_item_id: component.parentItemId,
                component_item_id: component.componentItemId,
                quantity: component.quantity,
                notes: component.notes
            })
            .select()
            .single()

        if (error) throw error
        if (!data) throw new Error('Failed to create item component')

        return this.mapToEntity(data)
    }

    async findByParentId(parentId: string): Promise<ItemComponent[]> {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('item_components')
            .select('*')
            .eq('parent_item_id', parentId)

        if (error) throw error

        return data.map(d => this.mapToEntity(d))
    }

    async findByComponentId(componentId: string): Promise<ItemComponent[]> {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('item_components')
            .select('*')
            .eq('component_item_id', componentId)

        if (error) throw error

        return data.map(d => this.mapToEntity(d))
    }

    async delete(parentId: string, componentId: string): Promise<void> {
        const supabase = await createClient()

        const { error } = await supabase
            .from('item_components')
            .delete()
            .eq('parent_item_id', parentId)
            .eq('component_item_id', componentId)

        if (error) throw error
    }

    private mapToEntity(data: any): ItemComponent {
        return {
            id: data.id,
            parentItemId: data.parent_item_id,
            componentItemId: data.component_item_id,
            quantity: data.quantity,
            notes: data.notes,
            createdAt: new Date(data.created_at)
        }
    }
}
