// Domain Layer - Organization bounded context errors

import { DomainError } from '@/lib/domain/DomainError'

export { DomainError }

export class InvalidOrganizationRoleError extends DomainError {
    constructor(role: string) {
        super(`Rol inválido: ${role}`)
    }
}

export class NotOrganizationMemberError extends DomainError {
    constructor() {
        super('No perteneces a esta organización')
    }
}

export class InsufficientPermissionsError extends DomainError {
    constructor() {
        super('No autorizado')
    }
}

export class OwnerRoleProtectedError extends DomainError {
    constructor() {
        super('Solo un propietario puede modificar o remover a otro propietario')
    }
}

export class MemberNotFoundError extends DomainError {
    constructor() {
        super('Miembro no encontrado')
    }
}

export class LastAdministratorError extends DomainError {
    constructor(action: 'remove' | 'demote') {
        super(
            action === 'remove'
                ? 'No se puede remover el único administrador de la organización'
                : 'No se puede degradar el único administrador de la organización'
        )
    }
}

export class InvitationNotFoundError extends DomainError {
    constructor() {
        super('El token de invitación no es válido')
    }
}

export class InvitationExpiredError extends DomainError {
    constructor(readonly expiresAt: Date) {
        super('Esta invitación ha expirado')
    }
}

export class InvitationAlreadyAcceptedError extends DomainError {
    constructor() {
        super('Esta invitación ya fue aceptada previamente')
    }
}

export class AlreadyOrganizationMemberError extends DomainError {
    constructor(readonly organizationName: string) {
        super(`Ya perteneces a la organización ${organizationName}`)
    }
}

export class InvitationEmailRequiredError extends DomainError {
    constructor() {
        super('Email requerido')
    }
}
