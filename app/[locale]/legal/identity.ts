/**
 * Identidad del responsable del tratamiento.
 *
 * ⚠️ PENDIENTE DE COMPLETAR ANTES DE MERGEAR.
 *
 * El RGPD (art. 13.1.a) y la LSSI (art. 10) obligan a identificar al responsable
 * con su denominación, NIF y domicilio. No se han inventado: los campos con
 * `PENDIENTE` deben rellenarse con los datos reales antes de publicar, o la
 * política queda incompleta a efectos legales.
 *
 * `legalName`, `taxId` y `address` son los únicos datos que faltan; el resto
 * está verificado contra la aplicación.
 */
export const CONTROLLER = {
    /** Denominación social completa, p. ej. "RocStatus S.L." */
    legalName: 'PENDIENTE',
    /** NIF / CIF */
    taxId: 'PENDIENTE',
    /** Domicilio a efectos de notificaciones */
    address: 'PENDIENTE',
    /** Proveedor de la base de datos, p. ej. "Neon" o "Amazon RDS" */
    databaseProvider: 'PENDIENTE',
    /** Verificado: es el contacto publicado en rocstatus.com */
    email: 'support@rocstatus.com',
    site: 'rocnest.app',
    parentSite: 'https://rocstatus.com',
} as const

/** true cuando la identidad esta completa; la pagina avisa si no lo esta. */
export function isControllerComplete(): boolean {
    return [
        CONTROLLER.legalName,
        CONTROLLER.taxId,
        CONTROLLER.address,
        CONTROLLER.databaseProvider,
    ].every((value) => value !== 'PENDIENTE')
}
