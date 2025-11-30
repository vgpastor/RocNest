// Infrastructure Layer - Supabase Transformation Repository

import { SupabaseClient } from '@supabase/supabase-js'
import { Transformation } from '../../domain/entities/Transformation'
import { ITransformationRepository } from '../../application/use-cases/SubdivideItemUseCase'

export class SupabaseTransformationRepository implements ITransformationRepository {
    constructor(private supabase: SupabaseClient) { }
    async create(transformation: Omit<Transformation, 'id' | 'createdAt'>): Promise<Transformation> {
        const { data, error } = await this.supabase
            .from('transformations')
            .insert({
                type: transformation.type,
                performed_by: transformation.performedBy,
                performed_at: transformation.performedAt.toISOString(),
                reason: transformation.reason,
                notes: transformation.notes,
                metadata: transformation.metadata
            })
            .select()
            .single()

        if (error) throw error
        if (!data) throw new Error('Failed to create transformation')

        return this.mapToEntity(data)
    }

    async addSourceItem(
        transformationId: string,
        itemId: string,
        quantity: number,
        notes?: string
    ): Promise<void> {
        const { error } = await this.supabase
            .from('transformation_items')
            .insert({
                transformation_id: transformationId,
                item_id: itemId,
                role: 'source',
                quantity,
                notes: notes || null
            })

        if (error) throw error
    }

    async addResultItem(
        transformationId: string,
        itemId: string,
        quantity: number,
        notes?: string
    ): Promise<void> {
        const { error } = await this.supabase
            .from('transformation_items')
            .insert({
                transformation_id: transformationId,
                item_id: itemId,
                role: 'result',
                quantity,
                notes: notes || null
            })

        if (error) throw error
    }

    async findById(id: string): Promise<Transformation | null> {
        const { data, error } = await this.supabase
            .from('transformations')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }

        return data ? this.mapToEntity(data) : null
    }

    async findByItemId(itemId: string): Promise<Transformation[]> {
        const { data, error } = await this.supabase
            .from('transformation_items')
            .select('transformation_id')
            .eq('item_id', itemId)

        if (error) throw error

        const transformationIds = data.map(d => d.transformation_id)
        if (transformationIds.length === 0) return []

        const { data: transformations, error: transformError } = await this.supabase
            .from('transformations')
            .select('*')
            .in('id', transformationIds)
            .order('performed_at', { ascending: false })

        if (transformError) throw transformError

        return transformations.map(t => this.mapToEntity(t))
    }

    private mapToEntity(data: any): Transformation {
        return {
            id: data.id,
            type: data.type,
            performedBy: data.performed_by,
            performedAt: new Date(data.performed_at),
            reason: data.reason,
            notes: data.notes,
            metadata: data.metadata || {},
            createdAt: new Date(data.created_at)
        }
    }
}
