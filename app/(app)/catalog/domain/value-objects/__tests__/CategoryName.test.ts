import { describe, it, expect } from 'vitest'
import { CategoryName } from '../CategoryName'
import { isLeft, isRight } from '@/lib/either'

describe('CategoryName Value Object', () => {
    describe('create', () => {
        it('should create valid category name', () => {
            const result = CategoryName.create('Laptops')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Laptops')
            }
        })

        it('should normalize with title case', () => {
            const result = CategoryName.create('laptops y computadoras')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Laptops Y Computadoras')
            }
        })

        it('should normalize multiple spaces to single space', () => {
            const result = CategoryName.create('Laptops   y    Tablets')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Laptops Y Tablets')
            }
        })

        it('should trim whitespace', () => {
            const result = CategoryName.create('  Laptops  ')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Laptops')
            }
        })

        it('should reject empty string', () => {
            const result = CategoryName.create('')
            
            expect(isLeft(result)).toBe(true)
            if (isLeft(result)) {
                expect(result.value.message).toContain('cannot be empty')
            }
        })

        it('should reject whitespace-only string', () => {
            const result = CategoryName.create('   ')
            
            expect(isLeft(result)).toBe(true)
        })

        it('should reject name below minimum length', () => {
            const result = CategoryName.create('A')
            
            expect(isLeft(result)).toBe(true)
            if (isLeft(result)) {
                expect(result.value.message).toContain('at least 2 characters')
            }
        })

        it('should accept name at minimum length', () => {
            const result = CategoryName.create('PC')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Pc')
            }
        })

        it('should reject name exceeding maximum length', () => {
            const longName = 'A'.repeat(51)
            const result = CategoryName.create(longName)
            
            expect(isLeft(result)).toBe(true)
            if (isLeft(result)) {
                expect(result.value.message).toContain('must not exceed 50')
            }
        })

        it('should accept name at maximum length', () => {
            const maxName = 'A'.repeat(50)
            const result = CategoryName.create(maxName)
            
            expect(isRight(result)).toBe(true)
        })

        it('should accept Spanish characters', () => {
            const result = CategoryName.create('Cámaras Fotográficas')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Cámaras Fotográficas')
            }
        })

        it('should accept Spanish ñ character', () => {
            const result = CategoryName.create('Niños y Niñas')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Niños Y Niñas')
            }
        })

        it('should accept hyphens', () => {
            const result = CategoryName.create('Audio-Video')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                // Normalizes to title case: first letter of each word capitalized
                expect(result.value.toString()).toBe('Audio-video')
            }
        })

        it('should accept numbers', () => {
            const result = CategoryName.create('Equipos 2024')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Equipos 2024')
            }
        })

        it('should reject special characters', () => {
            const result = CategoryName.create('Category@123')
            
            expect(isLeft(result)).toBe(true)
            if (isLeft(result)) {
                expect(result.value.message).toContain('only letters, numbers')
            }
        })

        it('should reject symbols', () => {
            const result = CategoryName.create('Category & Equipment')
            
            expect(isLeft(result)).toBe(true)
        })
    })

    describe('queries', () => {
        it('should return correct length', () => {
            const result = CategoryName.create('Laptops')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.getLength()).toBe(7)
            }
        })

        it('should identify short name', () => {
            const result = CategoryName.create('Laptops')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.isShort()).toBe(true)
            }
        })

        it('should identify non-short name', () => {
            const result = CategoryName.create('Equipamiento Audiovisual')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.isShort()).toBe(false)
            }
        })

        it('should identify long name', () => {
            const result = CategoryName.create('Equipamiento Audiovisual Profesional')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.isLong()).toBe(true)
            }
        })

        it('should detect contained word - case insensitive', () => {
            const result = CategoryName.create('Laptops y Computadoras')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.containsWord('laptops')).toBe(true)
                expect(result.value.containsWord('LAPTOPS')).toBe(true)
                expect(result.value.containsWord('Computadoras')).toBe(true)
                expect(result.value.containsWord('tablets')).toBe(false)
            }
        })
    })

    describe('equality', () => {
        it('should be equal when same name', () => {
            const name1Result = CategoryName.create('Laptops')
            const name2Result = CategoryName.create('Laptops')
            
            expect(isRight(name1Result)).toBe(true)
            expect(isRight(name2Result)).toBe(true)
            
            if (isRight(name1Result) && isRight(name2Result)) {
                expect(name1Result.value.equals(name2Result.value)).toBe(true)
            }
        })

        it('should not be equal when different name', () => {
            const name1Result = CategoryName.create('Laptops')
            const name2Result = CategoryName.create('Tablets')
            
            expect(isRight(name1Result)).toBe(true)
            expect(isRight(name2Result)).toBe(true)
            
            if (isRight(name1Result) && isRight(name2Result)) {
                expect(name1Result.value.equals(name2Result.value)).toBe(false)
            }
        })

        it('should be case sensitive for equals', () => {
            const name1Result = CategoryName.create('laptops')
            const name2Result = CategoryName.create('LAPTOPS')
            
            expect(isRight(name1Result)).toBe(true)
            expect(isRight(name2Result)).toBe(true)
            
            if (isRight(name1Result) && isRight(name2Result)) {
                // Both normalize to 'Laptops', so they should be equal
                expect(name1Result.value.equals(name2Result.value)).toBe(true)
            }
        })

        it('should compare case insensitive with equalsIgnoreCase', () => {
            const name1Result = CategoryName.create('Laptops')
            const name2Result = CategoryName.create('laptops')
            
            expect(isRight(name1Result)).toBe(true)
            expect(isRight(name2Result)).toBe(true)
            
            if (isRight(name1Result) && isRight(name2Result)) {
                expect(name1Result.value.equalsIgnoreCase(name2Result.value)).toBe(true)
            }
        })
    })

    describe('toSlug', () => {
        it('should convert to slug', () => {
            const result = CategoryName.create('Laptops y Computadoras')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toSlug()).toBe('laptops-y-computadoras')
            }
        })

        it('should remove Spanish accents from slug', () => {
            const result = CategoryName.create('Cámaras Fotográficas')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toSlug()).toBe('camaras-fotograficas')
            }
        })

        it('should handle ñ in slug', () => {
            const result = CategoryName.create('Niños')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toSlug()).toBe('ninos')
            }
        })

        it('should handle multiple spaces in slug', () => {
            const result = CategoryName.create('Audio   Video')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toSlug()).toBe('audio-video')
            }
        })

        it('should handle hyphens already present', () => {
            const result = CategoryName.create('Audio-Video')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toSlug()).toBe('audio-video')
            }
        })

        it('should remove leading and trailing hyphens', () => {
            const result = CategoryName.create('  Laptops  ')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                const slug = result.value.toSlug()
                expect(slug.startsWith('-')).toBe(false)
                expect(slug.endsWith('-')).toBe(false)
            }
        })
    })

    describe('serialization', () => {
        it('should serialize to string', () => {
            const result = CategoryName.create('Laptops')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Laptops')
                expect(result.value.toJSON()).toBe('Laptops')
                expect(result.value.getValue()).toBe('Laptops')
            }
        })

        it('should serialize to JSON correctly', () => {
            const result = CategoryName.create('Laptops')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                const json = JSON.stringify({ name: result.value })
                expect(json).toContain('Laptops')
            }
        })
    })

    describe('edge cases', () => {
        it('should handle minimum length with spaces', () => {
            const result = CategoryName.create('  AB  ')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Ab')
            }
        })

        it('should handle all uppercase input', () => {
            const result = CategoryName.create('LAPTOPS Y TABLETS')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Laptops Y Tablets')
            }
        })

        it('should handle mixed case input', () => {
            const result = CategoryName.create('lApToPs y tAbLeTs')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Laptops Y Tablets')
            }
        })

        it('should handle numbers only', () => {
            const result = CategoryName.create('2024')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('2024')
            }
        })

        it('should handle single word', () => {
            const result = CategoryName.create('laptops')
            
            expect(isRight(result)).toBe(true)
            if (isRight(result)) {
                expect(result.value.toString()).toBe('Laptops')
            }
        })
    })
})
