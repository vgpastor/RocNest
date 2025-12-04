// Domain Layer - Repository Interface
// IItemRepository (Port)
// This interface defines the contract for Item persistence
// Infrastructure layer will implement this interface

import { Item } from '../entities/Item'

export interface IItemRepository {
    // Create
    create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item>
    
    // Read
    findById(id: string): Promise<Item | null>
    findByIdentifier(identifier: string): Promise<Item | null>
    findByOrganization(organizationId: string): Promise<Item[]>
    findByCategory(categoryId: string): Promise<Item[]>
    findByStatus(status: string): Promise<Item[]>
    
    // Update
    update(id: string, data: Partial<Item>): Promise<Item>
    updateStatus(id: string, status: string): Promise<Item>
    
    // Delete
    softDelete(id: string, reason: string): Promise<void>
    
    // Queries
    exists(id: string): Promise<boolean>
    existsByIdentifier(identifier: string): Promise<boolean>
    
    // Save (for aggregate root pattern)
    save(item: Item): Promise<Item>
}
