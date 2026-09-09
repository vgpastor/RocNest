// Presentation - Role choices offered by the UI.
// `owner` is deliberately absent: it is granted on creation, never assigned here.

export interface RoleOption {
    value: string
    label: string
}

export const ASSIGNABLE_ROLE_OPTIONS: RoleOption[] = [
    { value: 'member', label: 'Miembro' },
    { value: 'admin', label: 'Admin' },
]

const LABELS: Record<string, string> = {
    owner: 'Propietario',
    admin: 'Admin',
    member: 'Miembro',
}

export function roleLabel(role: string): string {
    return LABELS[role] ?? role
}

/** Owner is immutable from the members screen, so its role is shown, not edited. */
export function isEditableRole(role: string): boolean {
    return ASSIGNABLE_ROLE_OPTIONS.some((option) => option.value === role)
}
