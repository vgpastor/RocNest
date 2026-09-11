/**
 * Identidad del responsable del tratamiento.
 *
 * El RGPD (art. 13.1.a) y la LSSI (art. 10) obligan a identificar al responsable
 * con su denominación, CIF y domicilio. `isControllerComplete` existe para que,
 * si alguno de esos campos se vacía, las páginas legales avisen en lugar de
 * publicarse incompletas.
 */
export const CONTROLLER = {
    /** Denominación social completa */
    legalName: 'Ingenieros Web S.L.',
    /** CIF */
    taxId: 'B86699436',
    /** Domicilio a efectos de notificaciones */
    address: 'C/ Ordicia 31, 28041 Madrid, España',
    /** Buzón específico para ejercer derechos y asuntos de protección de datos */
    privacyEmail: 'rgpd@ingenierosweb.co',
    /** Contacto general */
    email: 'info@ingenierosweb.co',
    site: 'rocnest.app',
    parentSite: 'https://rocstatus.com',
} as const

/**
 * true cuando la identidad está completa; si no, las páginas legales muestran un
 * aviso en lugar de publicarse sin identificar al responsable.
 */
export function isControllerComplete(): boolean {
    const required: readonly string[] = [
        CONTROLLER.legalName,
        CONTROLLER.taxId,
        CONTROLLER.address,
    ]
    return required.every((value) => value.trim().length > 0)
}
