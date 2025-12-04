// Domain Layer - Repository Interface
// ITransformationRepository (Port)
// This interface defines the contract for Transformation persistence

import { Transformation } from '../entities/Transformation'

export interface ITransformationRepository {
    // Create
    create(transformation: Omit<Transformation, 'id' | 'createdAt'>): Promise<Transformation>
    
    // Read
    findById(id: string): Promise<Transformation | null>
    findBySourceItem(sourceItemId: string): Promise<Transformation[]>
    findByResultItem(resultItemId: string): Promise<Transformation | null>
    findByOrganization(organizationId: string): Promise<Transformation[]>
    findByType(type: string): Promise<Transformation[]>
    
    // Queries
    exists(id: string): Promise<boolean>
    
    // Statistics
    countByType(organizationId: string, type: string): Promise<number>
}
