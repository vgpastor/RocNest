import { describe, it, expect } from 'vitest'

import { InvalidOrganizationRoleError } from '../../errors/OrganizationErrors'
import { OrganizationRole } from '../OrganizationRole'

describe('OrganizationRole', () => {
    it('treats owner and admin as administrative', () => {
        expect(OrganizationRole.fromString('owner').isAdministrative()).toBe(true)
        expect(OrganizationRole.fromString('admin').isAdministrative()).toBe(true)
        expect(OrganizationRole.fromString('member').isAdministrative()).toBe(false)
    })

    it('lets owners manage members, which is the bug ICEM Pallars hit', () => {
        expect(OrganizationRole.fromString('owner').canManageMembers()).toBe(true)
        expect(OrganizationRole.fromString('admin').canManageMembers()).toBe(true)
        expect(OrganizationRole.fromString('member').canManageMembers()).toBe(false)
    })

    it('rejects unknown roles', () => {
        expect(() => OrganizationRole.fromString('superuser')).toThrow(InvalidOrganizationRoleError)
    })

    it('never assigns owner through the UI', () => {
        expect(() => OrganizationRole.assignableFromString('owner')).toThrow(InvalidOrganizationRoleError)
        expect(OrganizationRole.assignableFromString('admin').value).toBe('admin')
        expect(OrganizationRole.assignableFromString('member').value).toBe('member')
    })

    it('exposes a human label used in emails and the UI', () => {
        expect(OrganizationRole.fromString('admin').label).toBe('administrador')
        expect(OrganizationRole.fromString('member').label).toBe('miembro')
        expect(OrganizationRole.fromString('owner').label).toBe('propietario')
    })

    it('only lets an owner act on another owner', () => {
        const owner = OrganizationRole.fromString('owner')
        const admin = OrganizationRole.fromString('admin')
        const member = OrganizationRole.member()

        expect(admin.canActOn(owner)).toBe(false)
        expect(owner.canActOn(owner)).toBe(true)
        expect(admin.canActOn(admin)).toBe(true)
        expect(admin.canActOn(member)).toBe(true)
        expect(member.canActOn(member)).toBe(false)
    })

    it('compares by value', () => {
        expect(OrganizationRole.fromString('admin').equals(OrganizationRole.fromString('admin'))).toBe(true)
        expect(OrganizationRole.fromString('admin').equals(OrganizationRole.member())).toBe(false)
    })
})
