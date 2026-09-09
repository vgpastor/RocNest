// Domain Layer - Value Object
// Encapsulates what each role is allowed to do, so the rule lives in one place
// instead of being re-implemented as `role === 'admin'` in every route.

import { InvalidOrganizationRoleError } from '../errors/OrganizationErrors'

export type OrganizationRoleValue = 'owner' | 'admin' | 'member'

const ADMINISTRATIVE: readonly OrganizationRoleValue[] = ['owner', 'admin']
const ASSIGNABLE: readonly OrganizationRoleValue[] = ['admin', 'member']
const ALL: readonly OrganizationRoleValue[] = ['owner', 'admin', 'member']

const LABELS: Record<OrganizationRoleValue, string> = {
    owner: 'propietario',
    admin: 'administrador',
    member: 'miembro',
}

export class OrganizationRole {
    private constructor(readonly value: OrganizationRoleValue) {}

    /** Any role persisted in the database. */
    static fromString(value: string): OrganizationRole {
        if (!ALL.includes(value as OrganizationRoleValue)) {
            throw new InvalidOrganizationRoleError(value)
        }
        return new OrganizationRole(value as OrganizationRoleValue)
    }

    /**
     * A role that can be handed out through the UI. `owner` is granted only when the
     * organization is created, never by invitation or by editing a member.
     */
    static assignableFromString(value: string): OrganizationRole {
        if (!ASSIGNABLE.includes(value as OrganizationRoleValue)) {
            throw new InvalidOrganizationRoleError(value)
        }
        return new OrganizationRole(value as OrganizationRoleValue)
    }

    static member(): OrganizationRole {
        return new OrganizationRole('member')
    }

    /** Owners and admins run the organization: members, catalog and settings. */
    isAdministrative(): boolean {
        return ADMINISTRATIVE.includes(this.value)
    }

    canManageMembers(): boolean {
        return this.isAdministrative()
    }

    isOwner(): boolean {
        return this.value === 'owner'
    }

    /** Only another owner may demote or remove an owner. */
    canActOn(target: OrganizationRole): boolean {
        return target.isOwner() ? this.isOwner() : this.canManageMembers()
    }

    equals(other: OrganizationRole): boolean {
        return this.value === other.value
    }

    get label(): string {
        return LABELS[this.value]
    }

    toString(): string {
        return this.value
    }

    static administrativeValues(): readonly OrganizationRoleValue[] {
        return ADMINISTRATIVE
    }
}
