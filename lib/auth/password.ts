import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10
const MIN_PASSWORD_LENGTH = 8

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
        return {
            valid: false,
            error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
        }
    }
    return { valid: true }
}
