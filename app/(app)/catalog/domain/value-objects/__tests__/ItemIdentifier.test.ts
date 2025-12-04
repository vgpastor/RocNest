import { describe, it, expect } from 'vitest'

import { isLeft, isRight } from '@/lib/either'

import { ItemIdentifier } from '../ItemIdentifier'

describe('ItemIdentifier Value Object', () => {
    describe('create', () => {
        it('should create valid identifier with alphanumeric', () => {
            const result = ItemIdentifier.create('LAPTOP-0001')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('LAPTOP-0001')
            }
        })

        it('should create valid identifier with underscores', () => {
            const result = ItemIdentifier.create('ITEM_ABC_123')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('ITEM_ABC_123')
            }
        })

        it('should normalize to uppercase', () => {
            const result = ItemIdentifier.create('laptop-0001')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('LAPTOP-0001')
            }
        })

        it('should trim whitespace', () => {
            const result = ItemIdentifier.create('  LAPTOP-0001  ')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('LAPTOP-0001')
            }
        })

        it('should reject empty string', () => {
            const result = ItemIdentifier.create('')
            
            expect(isLeft(result)).toBe(true)
            if (isLeft(result)) {
                expect(result.value.message).toContain('must not be empty')
            }
        })

        it('should reject whitespace-only string', () => {
            const result = ItemIdentifier.create('   ')
            
            expect(isLeft(result)).toBe(true)
        })

        it('should reject identifier exceeding max length', () => {
            const longIdentifier = 'A'.repeat(51)
            const result = ItemIdentifier.create(longIdentifier)
            
            expect(isLeft(result)).toBe(true)
            if (isLeft(result)) {
                expect(result.value.message).toContain('must not exceed 50')
            }
        })

        it('should accept identifier at max length', () => {
            const maxIdentifier = 'A'.repeat(50)
            const result = ItemIdentifier.create(maxIdentifier)
            
            expect(isRight(result)).toBe(true)
        })

        it('should reject special characters', () => {
            const result = ItemIdentifier.create('LAPTOP@123')
            
            expect(isLeft(result)).toBe(true)
            if (isLeft(result)) {
                expect(result.value.message).toContain('only letters, numbers, hyphens')
            }
        })

        it('should reject spaces', () => {
            const result = ItemIdentifier.create('LAPTOP 0001')
            
            expect(isLeft(result)).toBe(true)
        })

        it('should allow hyphens and underscores', () => {
            const result = ItemIdentifier.create('LAPTOP-ABC_123')
            
            expect(isRight(result)).toBe(true)
        })
    })

    describe('generateUnique', () => {
        it('should generate unique identifier with padding', () => {
            const result = ItemIdentifier.generateUnique('LAPTOP', 1)
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('LAPTOP-0001')
            }
        })

        it('should pad index to 4 digits', () => {
            const result = ItemIdentifier.generateUnique('ITEM', 42)
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('ITEM-0042')
            }
        })

        it('should handle large index numbers', () => {
            const result = ItemIdentifier.generateUnique('ITEM', 9999)
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('ITEM-9999')
            }
        })

        it('should handle very large index numbers', () => {
            const result = ItemIdentifier.generateUnique('ITEM', 12345)
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('ITEM-12345')
            }
        })
    })

    describe('hasNumbering', () => {
        it('should detect numbered identifier', () => {
            const result = ItemIdentifier.create('LAPTOP-0001')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.hasNumbering()).toBe(true)
            }
        })

        it('should detect non-numbered identifier', () => {
            const result = ItemIdentifier.create('UNIQUE-ITEM')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.hasNumbering()).toBe(false)
            }
        })

        it('should detect partial numbers as non-numbered', () => {
            const result = ItemIdentifier.create('ITEM-123')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.hasNumbering()).toBe(false)
            }
        })
    })

    describe('getBase', () => {
        it('should return base for numbered identifier', () => {
            const result = ItemIdentifier.create('LAPTOP-0001')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.getBase()).toBe('LAPTOP')
            }
        })

        it('should return full identifier for non-numbered', () => {
            const result = ItemIdentifier.create('UNIQUE-ITEM')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.getBase()).toBe('UNIQUE-ITEM')
            }
        })
    })

    describe('getNumber', () => {
        it('should extract number from numbered identifier', () => {
            const result = ItemIdentifier.create('LAPTOP-0001')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.getNumber()).toBe(1)
            }
        })

        it('should return null for non-numbered identifier', () => {
            const result = ItemIdentifier.create('UNIQUE-ITEM')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.getNumber()).toBe(null)
            }
        })

        it('should handle large numbers', () => {
            const result = ItemIdentifier.create('ITEM-9999')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.getNumber()).toBe(9999)
            }
        })
    })

    describe('equality', () => {
        it('should be equal when same identifier', () => {
            const id1Result = ItemIdentifier.create('LAPTOP-0001')
            const id2Result = ItemIdentifier.create('LAPTOP-0001')
            
            expect(isRight(id1Result)).toBe(true)
            expect(isRight(id2Result)).toBe(true)
            
            if (isRight(id1Result) && isRight(id2Result)) {
                expect(id1Result.value.equals(id2Result.value)).toBe(true)
            }
        })

        it('should not be equal when different identifier', () => {
            const id1Result = ItemIdentifier.create('LAPTOP-0001')
            const id2Result = ItemIdentifier.create('LAPTOP-0002')
            
            expect(isRight(id1Result)).toBe(true)
            expect(isRight(id2Result)).toBe(true)
            
            if (isRight(id1Result) && isRight(id2Result)) {
                expect(id1Result.value.equals(id2Result.value)).toBe(false)
            }
        })

        it('should normalize before comparison', () => {
            const id1Result = ItemIdentifier.create('laptop-0001')
            const id2Result = ItemIdentifier.create('LAPTOP-0001')
            
            expect(isRight(id1Result)).toBe(true)
            expect(isRight(id2Result)).toBe(true)
            
            if (isRight(id1Result) && isRight(id2Result)) {
                expect(id1Result.value.equals(id2Result.value)).toBe(true)
            }
        })
    })

    describe('serialization', () => {
        it('should serialize to string', () => {
            const result = ItemIdentifier.create('LAPTOP-0001')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('LAPTOP-0001')
                expect(result.value.toJSON()).toBe('LAPTOP-0001')
                expect(result.value.getValue()).toBe('LAPTOP-0001')
            }
        })

        it('should serialize to JSON correctly', () => {
            const result = ItemIdentifier.create('LAPTOP-0001')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                const json = JSON.stringify({ id: result.value })
                expect(json).toContain('LAPTOP-0001')
            }
        })
    })

    describe('edge cases', () => {
        it('should handle minimum length (1 character)', () => {
            const result = ItemIdentifier.create('A')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('A')
            }
        })

        it('should handle numbers only', () => {
            const result = ItemIdentifier.create('123456')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('123456')
            }
        })

        it('should handle mixed case normalization', () => {
            const result = ItemIdentifier.create('LaPtOp-0001')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('LAPTOP-0001')
            }
        })
    })
})
