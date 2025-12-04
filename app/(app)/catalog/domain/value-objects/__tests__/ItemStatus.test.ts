import { describe, it, expect } from 'vitest'

import { isLeft, isRight } from '@/lib/either'

import { ItemStatus } from '../ItemStatus'

describe('ItemStatus Value Object', () => {
    describe('create', () => {
        it('should create valid status - available', () => {
            const result = ItemStatus.create('available')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('available')
            }
        })

        it('should create valid status - reserved', () => {
            const result = ItemStatus.create('reserved')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('reserved')
            }
        })

        it('should reject invalid status', () => {
            const result = ItemStatus.create('invalid_status')
            
            expect(isLeft(result)).toBe(true)
            if (isLeft(result)) {
                expect(result.value.message).toContain('Invalid item status')
            }
        })

        it('should reject empty string', () => {
            const result = ItemStatus.create('')
            
            expect(isLeft(result)).toBe(true)
        })
    })

    describe('factory methods', () => {
        it('should create available status', () => {
            const status = ItemStatus.available()
            
            expect(status.toString()).toBe('available')
            expect(status.isAvailable()).toBe(true)
        })

        it('should create reserved status', () => {
            const status = ItemStatus.reserved()
            
            expect(status.toString()).toBe('reserved')
            expect(status.isAvailable()).toBe(false)
        })

        it('should create in_use status', () => {
            const status = ItemStatus.inUse()
            
            expect(status.toString()).toBe('in_use')
        })

        it('should create maintenance status', () => {
            const status = ItemStatus.maintenance()
            
            expect(status.toString()).toBe('maintenance')
        })

        it('should create donated status', () => {
            const status = ItemStatus.donated()
            
            expect(status.toString()).toBe('donated')
        })
    })

    describe('business logic queries', () => {
        it('should identify available status correctly', () => {
            const status = ItemStatus.available()
            
            expect(status.isAvailable()).toBe(true)
            expect(status.canBeReserved()).toBe(true)
            expect(status.canBeUsed()).toBe(true)
            expect(status.canBeModified()).toBe(true)
            expect(status.isTerminal()).toBe(false)
        })

        it('should identify reserved status correctly', () => {
            const status = ItemStatus.reserved()
            
            expect(status.isAvailable()).toBe(false)
            expect(status.canBeReserved()).toBe(false)
            expect(status.canBeReturned()).toBe(true)
            expect(status.canBeUsed()).toBe(true)
            expect(status.canBeModified()).toBe(true)
        })

        it('should identify in_use status correctly', () => {
            const status = ItemStatus.inUse()
            
            expect(status.canBeReturned()).toBe(true)
            expect(status.canBeReserved()).toBe(false)
        })

        it('should identify terminal statuses', () => {
            const donated = ItemStatus.donated()
            const discarded = ItemStatus.discarded()
            const lost = ItemStatus.lost()
            const disassembled = ItemStatus.disassembled()
            
            expect(donated.isTerminal()).toBe(true)
            expect(discarded.isTerminal()).toBe(true)
            expect(lost.isTerminal()).toBe(true)
            expect(disassembled.isTerminal()).toBe(true)
            
            expect(donated.canBeModified()).toBe(false)
            expect(discarded.canBeModified()).toBe(false)
        })

        it('should allow modification for non-terminal statuses', () => {
            const available = ItemStatus.available()
            const reserved = ItemStatus.reserved()
            const maintenance = ItemStatus.maintenance()
            
            expect(available.canBeModified()).toBe(true)
            expect(reserved.canBeModified()).toBe(true)
            expect(maintenance.canBeModified()).toBe(true)
        })
    })

    describe('equality', () => {
        it('should be equal when same status', () => {
            const status1 = ItemStatus.available()
            const status2 = ItemStatus.available()
            
            expect(status1.equals(status2)).toBe(true)
        })

        it('should not be equal when different status', () => {
            const status1 = ItemStatus.available()
            const status2 = ItemStatus.reserved()
            
            expect(status1.equals(status2)).toBe(false)
        })
    })

    describe('display methods', () => {
        it('should return correct label for available', () => {
            const status = ItemStatus.available()
            
            expect(status.getLabel()).toBe('Disponible')
            expect(status.getVariant()).toBe('success')
        })

        it('should return correct label for reserved', () => {
            const status = ItemStatus.reserved()
            
            expect(status.getLabel()).toBe('Reservado')
            expect(status.getVariant()).toBe('warning')
        })

        it('should return correct label for donated', () => {
            const status = ItemStatus.donated()
            
            expect(status.getLabel()).toBe('Donado')
            expect(status.getVariant()).toBe('default')
        })
    })

    describe('serialization', () => {
        it('should serialize to string', () => {
            const status = ItemStatus.available()
            
            expect(status.toString()).toBe('available')
            expect(status.toJSON()).toBe('available')
            expect(status.getValue()).toBe('available')
        })

        it('should serialize to JSON correctly', () => {
            const status = ItemStatus.reserved()
            const json = JSON.stringify({ status })
            
            expect(json).toContain('reserved')
        })
    })

    describe('all valid statuses', () => {
        const validStatuses = [
            'available',
            'reserved',
            'in_use',
            'maintenance',
            'subdivided',
            'donated',
            'discarded',
            'lost',
            'disassembled',
        ]

        validStatuses.forEach(status => {
            it(`should accept valid status: ${status}`, () => {
                const result = ItemStatus.create(status)
                
                expect(isRight(result)).toBe(true)
                if (isRight(result)) {
                    expect(result.value.toString()).toBe(status)
                }
            })
        })
    })
})
