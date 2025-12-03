import { Category } from '../entities/Category'

export interface ICategoryRepository {
    findAll(organizationId: string): Promise<Category[]>
    findById(id: string): Promise<Category | null>
    create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category>
    update(id: string, category: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category>
    delete(id: string): Promise<void>
}
