import type { Locale } from '@/lib/i18n'

export type LegalSection = { heading: string; paragraphs: string[]; bullets?: string[] }
export type LegalDocument = { title: string; updated: string; intro: string; sections: LegalSection[] }

export type LegalContent = {
    privacy: LegalDocument
    cookies: LegalDocument & {
        tableHeadings: { name: string; owner: string; category: string; purpose: string; duration: string }
        categories: Record<'necessary' | 'analytics' | 'marketing', string>
        purposes: Record<string, string>
        durations: Record<string, string>
        manageCta: string
    }
    incompleteWarning: string
}

/** Fecha de la ultima revision del texto legal. Actualizar al cambiarlo. */
const UPDATED = '2026-09-11'

const es: LegalContent = {
    incompleteWarning:
        'Este texto está pendiente de completar con los datos identificativos del responsable. No debe publicarse tal cual.',
    privacy: {
        title: 'Política de privacidad',
        updated: UPDATED,
        intro:
            'Esta política explica qué datos personales tratamos en RocNest, con qué finalidad, con qué base jurídica y qué puedes hacer al respecto. Está redactada conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).',
        sections: [
            {
                heading: 'Quién es el responsable',
                paragraphs: [
                    'El responsable del tratamiento de tus datos es {{controller}}, con NIF {{taxId}} y domicilio en {{address}}.',
                    'Para cualquier cuestión relacionada con tus datos personales puedes escribir a {{email}}.',
                ],
            },
            {
                heading: 'Qué datos tratamos',
                paragraphs: ['Tratamos únicamente los datos que necesitamos para prestarte el servicio:'],
                bullets: [
                    'Datos de cuenta: tu nombre y tu dirección de correo electrónico. La contraseña se guarda cifrada y no podemos leerla.',
                    'Datos de la organización: el nombre del club o entidad y las personas a las que invitas, con el rol que les asignas.',
                    'Datos que tú introduces: el inventario de material, las reservas, los préstamos y las revisiones que registras. Son tuyos y solo los tratamos para que la aplicación funcione.',
                    'Datos técnicos: dirección IP y datos de la petición, registrados por nuestro proveedor de alojamiento por seguridad y para diagnosticar errores.',
                    'Datos de uso: solo si aceptas las cookies de analítica. Son estadísticas agregadas sobre qué páginas se visitan.',
                ],
            },
            {
                heading: 'Para qué los usamos y con qué base legal',
                paragraphs: [],
                bullets: [
                    'Prestarte el servicio y gestionar tu cuenta: ejecución del contrato (art. 6.1.b RGPD). Sin estos datos no podemos darte acceso.',
                    'Enviarte correos imprescindibles —invitaciones, verificación, recuperación de contraseña—: ejecución del contrato (art. 6.1.b RGPD).',
                    'Mantener la seguridad del servicio y prevenir abusos: interés legítimo (art. 6.1.f RGPD).',
                    'Medir el uso del sitio con Google Analytics: tu consentimiento (art. 6.1.a RGPD), que puedes retirar cuando quieras.',
                ],
            },
            {
                heading: 'Quién más accede a tus datos',
                paragraphs: [
                    'No vendemos tus datos ni los cedemos a terceros con fines comerciales. Sí nos apoyamos en proveedores que actúan como encargados del tratamiento y solo pueden usarlos para prestarnos su servicio:',
                ],
                bullets: [
                    'Vercel Inc. — alojamiento de la aplicación.',
                    'Amazon Web Services — almacenamiento de imágenes (S3) y envío de correo transaccional (SES), en la región eu-west-1 (Irlanda).',
                    '{{databaseProvider}} — alojamiento de la base de datos.',
                    'Google Ireland Ltd. — analítica web, únicamente si has dado tu consentimiento.',
                ],
            },
            {
                heading: 'Transferencias fuera de la Unión Europea',
                paragraphs: [
                    'Algunos de estos proveedores son estadounidenses y pueden tratar datos fuera del Espacio Económico Europeo. En esos casos la transferencia se ampara en las cláusulas contractuales tipo aprobadas por la Comisión Europea y, cuando aplica, en el Data Privacy Framework al que están adheridos.',
                ],
            },
            {
                heading: 'Cuánto tiempo los conservamos',
                paragraphs: [
                    'Conservamos los datos de tu cuenta mientras la mantengas activa. Si la eliminas, borramos tus datos personales salvo los que debamos conservar por obligación legal, y durante el plazo que esa obligación imponga.',
                    'Los datos de analítica se conservan según la configuración de Google Analytics, con un máximo de 14 meses.',
                ],
            },
            {
                heading: 'Tus derechos',
                paragraphs: [
                    'Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar el consentimiento que hayas dado. Escríbenos a {{email}} y te responderemos en el plazo máximo de un mes.',
                    'Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es), C/ Jorge Juan 6, 28001 Madrid.',
                ],
            },
            {
                heading: 'Seguridad',
                paragraphs: [
                    'El tráfico viaja cifrado mediante HTTPS, las contraseñas se almacenan con funciones de derivación de clave y el acceso a los datos de cada organización está restringido por roles. Ningún sistema es infalible, pero mantenemos medidas técnicas y organizativas proporcionadas al riesgo.',
                ],
            },
            {
                heading: 'Menores de edad',
                paragraphs: [
                    'RocNest está dirigido a clubes y entidades deportivas, y las cuentas deben crearlas personas mayores de 14 años. Si un club gestiona material de socios menores, es el club quien debe contar con la base jurídica adecuada para tratar sus datos.',
                ],
            },
            {
                heading: 'Cambios en esta política',
                paragraphs: [
                    'Si modificamos esta política publicaremos aquí la nueva versión y actualizaremos la fecha de revisión. Si el cambio es sustancial, te avisaremos.',
                ],
            },
        ],
    },
    cookies: {
        title: 'Política de cookies',
        updated: UPDATED,
        intro:
            'Una cookie es un pequeño archivo que un sitio web guarda en tu navegador. Aquí tienes todas las que usa RocNest, para qué sirven y cómo puedes controlarlas.',
        manageCta: 'Cambiar mis preferencias de cookies',
        tableHeadings: {
            name: 'Nombre',
            owner: 'Titular',
            category: 'Categoría',
            purpose: 'Finalidad',
            duration: 'Duración',
        },
        categories: {
            necessary: 'Necesaria',
            analytics: 'Analítica',
            marketing: 'Marketing',
        },
        purposes: {
            session: 'Mantiene tu sesión iniciada.',
            currentOrganization: 'Recuerda con qué organización estás trabajando.',
            consent: 'Guarda tu decisión sobre las cookies para no volver a preguntarte.',
            gaUser: 'Distingue usuarios para las estadísticas de Google Analytics.',
            gaSession: 'Mantiene el estado de la sesión en Google Analytics.',
        },
        durations: {
            session: 'Hasta cerrar el navegador',
            sevenDays: '7 días',
            twoYears: '2 años',
            localStoragePersistent: 'Hasta que la borres (almacenamiento local)',
        },
        sections: [
            {
                heading: 'Cómo pedimos tu permiso',
                paragraphs: [
                    'Las cookies necesarias se instalan siempre: sin ellas la web no funciona, y por eso el artículo 22.2 de la LSSI no exige consentimiento para ellas.',
                    'Las de analítica solo se activan si las aceptas. Hasta que decidas, usamos el Modo de consentimiento de Google: las etiquetas se cargan pero no guardan ningún identificador tuyo.',
                ],
            },
            {
                heading: 'Cómo cambiar o retirar tu decisión',
                paragraphs: [
                    'Puedes cambiar de opinión cuando quieras desde el enlace "Preferencias de cookies" del pie de página, o con el botón que verás debajo. Retirar el consentimiento es tan sencillo como darlo.',
                    'También puedes borrar o bloquear cookies desde la configuración de tu navegador. Ten en cuenta que si bloqueas las necesarias, la aplicación dejará de funcionar correctamente.',
                ],
            },
        ],
    },
}

const en: LegalContent = {
    incompleteWarning:
        'This text still needs the controller identification details. It must not be published as is.',
    privacy: {
        title: 'Privacy policy',
        updated: UPDATED,
        intro:
            'This policy explains what personal data RocNest processes, why, on what legal basis, and what you can do about it. It follows Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018.',
        sections: [
            {
                heading: 'Who the controller is',
                paragraphs: [
                    'The controller of your data is {{controller}}, tax ID {{taxId}}, registered at {{address}}.',
                    'For anything related to your personal data, write to {{email}}.',
                ],
            },
            {
                heading: 'What data we process',
                paragraphs: ['We process only what we need to run the service:'],
                bullets: [
                    'Account data: your name and email address. Your password is stored hashed and we cannot read it.',
                    'Organisation data: the name of your club and the people you invite, with the role you assign them.',
                    'Data you enter: the equipment inventory, bookings, loans and safety reviews you record. They are yours, and we process them only to make the application work.',
                    'Technical data: IP address and request metadata, logged by our hosting provider for security and error diagnosis.',
                    'Usage data: only if you accept analytics cookies. Aggregated statistics about which pages are visited.',
                ],
            },
            {
                heading: 'Why we use it and on what legal basis',
                paragraphs: [],
                bullets: [
                    'Providing the service and managing your account: performance of a contract (Art. 6(1)(b) GDPR). Without this data we cannot give you access.',
                    'Sending essential emails — invitations, verification, password recovery: performance of a contract (Art. 6(1)(b) GDPR).',
                    'Keeping the service secure and preventing abuse: legitimate interest (Art. 6(1)(f) GDPR).',
                    'Measuring site usage with Google Analytics: your consent (Art. 6(1)(a) GDPR), which you may withdraw at any time.',
                ],
            },
            {
                heading: 'Who else accesses your data',
                paragraphs: [
                    'We do not sell your data or share it with third parties for commercial purposes. We do rely on providers acting as processors, who may use it only to provide us their service:',
                ],
                bullets: [
                    'Vercel Inc. — application hosting.',
                    'Amazon Web Services — image storage (S3) and transactional email (SES), in the eu-west-1 region (Ireland).',
                    '{{databaseProvider}} — database hosting.',
                    'Google Ireland Ltd. — web analytics, only if you have given consent.',
                ],
            },
            {
                heading: 'Transfers outside the European Union',
                paragraphs: [
                    'Some of these providers are US-based and may process data outside the European Economic Area. Those transfers rely on the Standard Contractual Clauses approved by the European Commission and, where applicable, on the Data Privacy Framework they adhere to.',
                ],
            },
            {
                heading: 'How long we keep it',
                paragraphs: [
                    'We keep your account data while your account is active. If you delete it, we erase your personal data except what we must retain by law, and only for as long as that obligation requires.',
                    'Analytics data is retained per the Google Analytics configuration, up to a maximum of 14 months.',
                ],
            },
            {
                heading: 'Your rights',
                paragraphs: [
                    'You may exercise your rights of access, rectification, erasure, objection, restriction and portability at any time, and withdraw any consent you gave. Write to {{email}} and we will reply within one month at the latest.',
                    'If you believe we have not handled your request properly, you may complain to the Spanish Data Protection Agency (www.aepd.es), C/ Jorge Juan 6, 28001 Madrid.',
                ],
            },
            {
                heading: 'Security',
                paragraphs: [
                    'Traffic is encrypted over HTTPS, passwords are stored using key derivation functions, and access to each organisation’s data is restricted by role. No system is infallible, but we maintain technical and organisational measures proportionate to the risk.',
                ],
            },
            {
                heading: 'Minors',
                paragraphs: [
                    'RocNest is aimed at sports clubs and organisations, and accounts must be created by people over 14. If a club manages equipment for underage members, it is the club that must have the appropriate legal basis to process their data.',
                ],
            },
            {
                heading: 'Changes to this policy',
                paragraphs: [
                    'If we change this policy we will publish the new version here and update the revision date. If the change is substantial, we will let you know.',
                ],
            },
        ],
    },
    cookies: {
        title: 'Cookie policy',
        updated: UPDATED,
        intro:
            'A cookie is a small file a website stores in your browser. Here is every cookie RocNest uses, what it does, and how you can control it.',
        manageCta: 'Change my cookie preferences',
        tableHeadings: {
            name: 'Name',
            owner: 'Owner',
            category: 'Category',
            purpose: 'Purpose',
            duration: 'Duration',
        },
        categories: {
            necessary: 'Necessary',
            analytics: 'Analytics',
            marketing: 'Marketing',
        },
        purposes: {
            session: 'Keeps you signed in.',
            currentOrganization: 'Remembers which organisation you are working with.',
            consent: 'Stores your cookie decision so we do not ask again.',
            gaUser: 'Distinguishes users for Google Analytics statistics.',
            gaSession: 'Maintains session state in Google Analytics.',
        },
        durations: {
            session: 'Until you close the browser',
            sevenDays: '7 days',
            twoYears: '2 years',
            localStoragePersistent: 'Until you clear it (local storage)',
        },
        sections: [
            {
                heading: 'How we ask for permission',
                paragraphs: [
                    'Necessary cookies are always set: the site does not work without them, which is why Art. 22.2 of the Spanish LSSI does not require consent for them.',
                    'Analytics cookies only run if you accept them. Until you decide, we use Google Consent Mode: tags load but store no identifier of yours.',
                ],
            },
            {
                heading: 'How to change or withdraw your decision',
                paragraphs: [
                    'You can change your mind at any time from the "Cookie settings" link in the footer, or with the button below. Withdrawing consent is as easy as giving it.',
                    'You can also delete or block cookies from your browser settings. Note that blocking the necessary ones will stop the application from working properly.',
                ],
            },
        ],
    },
}

const CONTENT: Record<Locale, LegalContent> = { es, en }

export function getLegalContent(locale: Locale): LegalContent {
    return CONTENT[locale] ?? CONTENT.es
}
