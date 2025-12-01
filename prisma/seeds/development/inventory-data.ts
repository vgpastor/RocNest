// Real inventory data for development seed
// Based on actual climbing club equipment

export interface InventoryItem {
    category: string
    brand: string
    model: string
    quantity: number
    characteristics: string
    unitPrice: number
    totalPrice: number
}

export const INVENTORY_DATA: InventoryItem[] = [
    // AUTOSOCORRO Y RESCATE
    { category: 'Autosocorro', brand: 'Petzl', model: 'Tibloc', quantity: 10, characteristics: 'Bloqueador ultraligero para rescate', unitPrice: 35, totalPrice: 350 },
    { category: 'Autosocorro', brand: 'Edelrid', model: 'Spoc', quantity: 6, characteristics: 'Bloqueador polea alternativa', unitPrice: 90, totalPrice: 540 },
    { category: 'Autosocorro', brand: 'Petzl', model: 'Rescuecender', quantity: 4, characteristics: 'Bloqueador de rescate', unitPrice: 70, totalPrice: 280 },
    { category: 'Autosocorro', brand: 'Petzl', model: 'Rollclip A', quantity: 10, characteristics: 'Mosquetón con polea integrada', unitPrice: 45, totalPrice: 450 },
    { category: 'Autosocorro', brand: 'Petzl', model: 'Jag System 2m', quantity: 2, characteristics: 'Kit polipasto 4:1 listo', unitPrice: 180, totalPrice: 360 },
    { category: 'Autosocorro', brand: 'Singing Rock', model: 'Lift', quantity: 4, characteristics: 'Dispositivo izado rápido', unitPrice: 75, totalPrice: 300 },
    { category: 'Cuchillo', brand: 'Petzl', model: 'Spatha', quantity: 10, characteristics: 'Cuchillo plegable para cuerda', unitPrice: 25, totalPrice: 250 },

    // INSTALACIÓN AVANZADA
    { category: 'Bolsa tornillería', brand: 'Rodcle', model: 'Bolsito tornillos', quantity: 10, characteristics: 'Bolsa lateral instalación', unitPrice: 22, totalPrice: 220 },
    { category: 'Martillo especial', brand: 'Fixe', model: 'Hammer Espeleo', quantity: 6, characteristics: 'Para spits y desmontaje', unitPrice: 40, totalPrice: 240 },
    { category: 'Extractor spits', brand: 'Fixe', model: 'Extractor Universal', quantity: 4, characteristics: 'Retirada de viejos anclajes', unitPrice: 45, totalPrice: 180 },
    { category: 'Llave dinamométrica', brand: 'Compact', model: 'Modelo 20Nm', quantity: 2, characteristics: 'Para instalar parabolts correctamente', unitPrice: 95, totalPrice: 190 },
    { category: 'Parabolts Inox', brand: 'Fixe', model: '10x100 Inox A4', quantity: 100, characteristics: 'Bolt con tuerca y arandela', unitPrice: 2.5, totalPrice: 250 },
    { category: 'Parabolts Inox', brand: 'Fixe', model: '8x80 Inox A4', quantity: 80, characteristics: 'Instalaciones ligeras', unitPrice: 1.8, totalPrice: 144 },
    { category: 'Chapistas', brand: 'Fixe', model: 'Hangar 10mm Inox', quantity: 100, characteristics: 'Placas inox muro', unitPrice: 2.8, totalPrice: 280 },

    // GESTIÓN Y MANTENIMIENTO DEL MATERIAL
    { category: 'Etiquetas', brand: 'RopeMark', model: 'ID para cuerdas', quantity: 200, characteristics: 'Números e identificación', unitPrice: 0.20, totalPrice: 40 },
    { category: 'Marcador cuerdas', brand: 'Beal', model: 'Marker', quantity: 10, characteristics: 'Tinta homologada para cuerdas', unitPrice: 8, totalPrice: 80 },
    { category: 'Malla secado', brand: 'Rodcle', model: 'Secador cuerdas XXL', quantity: 6, characteristics: 'Para secar material tras salidas', unitPrice: 30, totalPrice: 180 },
    { category: 'Bolsas inventario', brand: 'Rodcle', model: 'Saco transporte 80L', quantity: 6, characteristics: 'Transporte y clasificación', unitPrice: 45, totalPrice: 270 },
    { category: 'Carros transporte', brand: 'Brico', model: 'Carro Plegable Pro', quantity: 2, characteristics: 'Para mover material del almacén', unitPrice: 90, totalPrice: 180 },

    // HERRAMIENTAS Y CONSUMIBLES
    { category: 'Herramienta multiuso', brand: 'Leatherman', model: 'Rebar', quantity: 4, characteristics: 'Multiherramienta', unitPrice: 95, totalPrice: 380 },
    { category: 'Taladro respaldo', brand: 'Bosch', model: 'GBH 18V-21', quantity: 1, characteristics: 'Perforadora secundaria', unitPrice: 240, totalPrice: 240 },
    { category: 'Baterías extra', brand: 'Hilti', model: 'B22 8Ah', quantity: 4, characteristics: 'Autonomía para perforación', unitPrice: 150, totalPrice: 600 },
    { category: 'Sellador', brand: 'Fischer', model: 'FIS M', quantity: 6, characteristics: 'Resina más económica para entreno', unitPrice: 15, totalPrice: 90 },
    { category: 'Cinta americana', brand: '3M', model: 'Duct Tape', quantity: 12, characteristics: 'Reparación rápida', unitPrice: 6, totalPrice: 72 },
    { category: 'Bridas robustas', brand: 'Würth', model: 'Pack 100', quantity: 10, characteristics: 'Orden y fijación', unitPrice: 4, totalPrice: 40 },
    { category: 'Pilas CR123A', brand: 'Energizer', model: 'Pack 12', quantity: 10, characteristics: 'Para frontales y balizas', unitPrice: 25, totalPrice: 250 },

    // ILUMINACIÓN Y SEÑALIZACIÓN
    { category: 'Luz química', brand: 'Cyalume', model: '30 min blanco', quantity: 50, characteristics: 'Marcaje en cavidades', unitPrice: 1.7, totalPrice: 85 },
    { category: 'Baliza estroboscópica', brand: 'Fenix', model: 'CL20R SOS', quantity: 4, characteristics: 'Baliza para grandes cavidades', unitPrice: 35, totalPrice: 140 },
    { category: 'Linterna respaldo', brand: 'Fenix', model: 'LD22', quantity: 10, characteristics: 'Luz secundaria', unitPrice: 45, totalPrice: 450 },

    // ELEMENTOS DE ANCLAJE Y PROTECCIÓN
    { category: 'Aisladores cuerda', brand: 'Petzl', model: 'Protector Rope Protector', quantity: 10, characteristics: 'Protector bordes', unitPrice: 22, totalPrice: 220 },
    { category: 'Protector cuerda', brand: 'Petzl', model: 'Protector Caterpillar', quantity: 4, characteristics: 'Secciones articuladas', unitPrice: 55, totalPrice: 220 },
    { category: 'Alfombra cuerda', brand: 'Rodcle', model: 'Campo Maniobra', quantity: 6, characteristics: 'Protección para maniobras', unitPrice: 30, totalPrice: 180 },
    { category: 'Anillos polipropileno', brand: 'Edelrid', model: 'Loop Runner 240', quantity: 10, characteristics: 'Anillos largos para desviadores', unitPrice: 14, totalPrice: 140 },

    // COMUNICACIONES
    { category: 'Radio PMR', brand: 'Motorola', model: 'XT420', quantity: 6, characteristics: 'Radios robustas para cuevas', unitPrice: 130, totalPrice: 780 },
    { category: 'Radio profesional', brand: 'Kenwood', model: 'TK-3701D', quantity: 4, characteristics: 'PMR digital profesional', unitPrice: 200, totalPrice: 800 },
    { category: 'Cables antena improvisada', brand: 'Genérico', model: 'Cable 5m', quantity: 10, characteristics: 'Para mejorar recepción', unitPrice: 8, totalPrice: 80 },
    { category: 'Bolsa estanca comunicación', brand: 'AquaPac', model: 'Small Radio', quantity: 4, characteristics: 'Protección total', unitPrice: 35, totalPrice: 140 },

    // BOLSAS Y TRANSPORTE
    { category: 'Bidones estancos', brand: 'Tatonka', model: '10L', quantity: 10, characteristics: 'Para material sensible', unitPrice: 25, totalPrice: 250 },
    { category: 'Bidones estancos', brand: 'Tatonka', model: '30L', quantity: 6, characteristics: 'Para botiquines y electrónica', unitPrice: 35, totalPrice: 210 },
    { category: 'Mochila técnica', brand: 'Rodcle', model: 'Cueva 45L', quantity: 6, characteristics: 'Exploración avanzada', unitPrice: 110, totalPrice: 660 },

    // BOTIQUINES – COMPLEMENTOS
    { category: 'Vendas israelíes', brand: 'FirstCare', model: 'Modelo 6"', quantity: 20, characteristics: 'Hemorragias graves', unitPrice: 8, totalPrice: 160 },
    { category: 'Torniquete', brand: 'Recon Medical', model: 'Gen 4', quantity: 10, characteristics: 'Torniquete homologado', unitPrice: 35, totalPrice: 350 },
    { category: 'Antiséptico', brand: 'Clorhexidina', model: '250ml', quantity: 10, characteristics: 'Limpieza heridas', unitPrice: 4, totalPrice: 40 },
    { category: 'Guantes nitrilo', brand: 'Ansell', model: 'Caja 100', quantity: 6, characteristics: 'Protección sanitaria', unitPrice: 10, totalPrice: 60 },

    // MATERIAL PARA ENTRENAMIENTO DEL CLUB
    { category: 'Maniquí rescate', brand: 'Simulaids', model: '70kg', quantity: 1, characteristics: 'Entreno de evacuaciones', unitPrice: 480, totalPrice: 480 },
    { category: 'Cuerda vieja', brand: 'Para entrenos', model: '50m', quantity: 4, characteristics: 'Prácticas de nudos', unitPrice: 40, totalPrice: 160 },
    { category: 'Anclajes práctica', brand: 'Genérico', model: 'Pack 20', quantity: 20, characteristics: 'Instalación no estructural', unitPrice: 1, totalPrice: 20 },

    // CONTROL DE SEGURIDAD Y ORGANIZACIÓN
    { category: 'Checkpoints RFID', brand: 'Genérico', model: 'RFID iButton', quantity: 20, characteristics: 'Control material', unitPrice: 4, totalPrice: 80 },
    { category: 'Termómetro/Higrómetro', brand: 'Xiaomi', model: 'Mi Temp', quantity: 4, characteristics: 'Control almacén', unitPrice: 15, totalPrice: 60 },
    { category: 'Cámara almacén', brand: 'Reolink', model: 'Argus 3 Pro', quantity: 2, characteristics: 'Control seguridad', unitPrice: 80, totalPrice: 160 },
]

// Helper function to normalize category name for slug generation
export function normalizeCategoryName(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}
