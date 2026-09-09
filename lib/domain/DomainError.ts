// Shared Kernel - Base Domain Error
// Every bounded context builds its own errors on top of this class.

export abstract class DomainError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}
