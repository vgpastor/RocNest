// Functional Programming - Either Type
// For Railway Oriented Programming (error handling)

export type Either<L, R> = Left<L> | Right<R>

export class Left<L> {
    readonly value: L
    readonly isLeft = true as const
    readonly isRight = false as const

    constructor(value: L) {
        this.value = value
    }

    static of<L>(value: L): Left<L> {
        return new Left(value)
    }
}

export class Right<R> {
    readonly value: R
    readonly isLeft = false as const
    readonly isRight = true as const

    constructor(value: R) {
        this.value = value
    }

    static of<R>(value: R): Right<R> {
        return new Right(value)
    }
}

// Helper functions
export const left = <L>(value: L): Left<L> => new Left(value)
export const right = <R>(value: R): Right<R> => new Right(value)

// Type guards
export const isLeft = <L, R>(e: Either<L, R>): e is Left<L> => e.isLeft
export const isRight = <L, R>(e: Either<L, R>): e is Right<R> => e.isRight
