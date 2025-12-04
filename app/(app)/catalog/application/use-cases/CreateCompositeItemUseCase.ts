// Application Layer - Use Case
// Create Composite Item Use Case

import { Item } from '../../domain/entities/Item'
import { ItemComponent } from '../../domain/entities/Item'
import { CreateCompositeItemInput, CreateCompositeItemOutput } from '../dtos/ItemDTOs'

import { CreateItemUseCase, IItemRepository } from './CreateItemUseCase'

export interface IItemComponentRepository {
    create(component: Omit<ItemComponent, 'id' | 'createdAt'>): Promise<ItemComponent>
    findByParentId(parentId: string): Promise<ItemComponent[]>
    findByComponentId(componentId: string): Promise<ItemComponent[]>
}

export class CreateCompositeItemUseCase {
    constructor(
        private createItemUseCase: CreateItemUseCase,
        private itemRepository: IItemRepository,
        private componentRepository: IItemComponentRepository
    ) { }

    async execute(input: CreateCompositeItemInput): Promise<CreateCompositeItemOutput> {
        try {
            // 1. Validate components exist and are available
            for (const comp of input.components) {
                const item = await this.itemRepository.findById(comp.itemId)

                if (!item) {
                    return {
                        success: false,
                        error: `Componente con ID ${comp.itemId} no encontrado`
                    }
                }

                // Check if component is available
                if (!item.status.isAvailable()) {
                    return {
                        success: false,
                        error: `El componente "${item.name}" no está disponible (estado: ${item.status.getLabel()})`
                    }
                }

                // Check if component is already part of another composite
                const existingUse = await this.componentRepository.findByComponentId(comp.itemId)
                if (existingUse.length > 0) {
                    return {
                        success: false,
                        error: `El componente "${item.name}" ya es parte de otro item compuesto`
                    }
                }

                // Check for circular dependency
                if (item.isComposite) {
                    return {
                        success: false,
                        error: `No se puede usar un item compuesto como componente`
                    }
                }
            }

            // 2. Create the parent item (force quantity to 1 for composite items)
            const createResult = await this.createItemUseCase.execute({
                ...input.itemData,
                quantity: 1,
                hasUniqueNumbering: false // Composite items don't use numbering
            })

            if (!createResult.success || !createResult.items || createResult.items.length === 0) {
                return {
                    success: false,
                    error: createResult.error || 'Error al crear el item compuesto'
                }
            }

            const parentItem = createResult.items[0]

            // 3. Mark parent as composite
            // This would be done through repository update
            // For now, we'll create the components

            // 4. Create component relationships
            const componentResults = []
            for (const comp of input.components) {
                const component = await this.componentRepository.create({
                    parentItemId: parentItem.id,
                    componentItemId: comp.itemId,
                    quantity: comp.quantity,
                    notes: comp.notes || null
                })

                componentResults.push({
                    itemId: comp.itemId,
                    quantity: comp.quantity
                })
            }

            return {
                success: true,
                item: {
                    id: parentItem.id,
                    identifier: parentItem.identifier,
                    name: parentItem.name,
                    components: componentResults
                }
            }
        } catch (error) {
            console.error('Error in CreateCompositeItemUseCase:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            }
        }
    }
}

// Extend IItemRepository interface
declare module './CreateItemUseCase' {
    interface IItemRepository {
        findById(id: string): Promise<Item | null>
    }
}
