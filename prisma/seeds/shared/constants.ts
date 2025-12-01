// Constantes reutilizables para seeds

export const ORGANIZATION_TYPES = ['Club', 'Escuela', 'Federación', 'Asociación', 'Grupo', 'Centro']

export const ACTIVITY_TYPES = [
    'Montaña',
    'Escalada',
    'Espeleología',
    'Senderismo',
    'Alpinismo',
    'Barranquismo',
    'Vía Ferrata',
]

export const SPANISH_REGIONS = [
    'Madrid',
    'Cataluña',
    'Andalucía',
    'Euskadi',
    'Aragón',
    'Valencia',
    'Galicia',
    'Castilla y León',
    'Asturias',
    'Navarra',
]

// Categorías de equipamiento
export const EQUIPMENT_CATEGORIES = [
    { name: 'Cuerdas', slug: 'cuerdas', icon: '🪢', description: 'Cuerdas de escalada y espeleología' },
    { name: 'Mosquetones', slug: 'mosquetones', icon: '🔗', description: 'Mosquetones de seguridad' },
    { name: 'Sacas', slug: 'sacas', icon: '🎒', description: 'Mochilas y sacas de transporte' },
    { name: 'Cascos', slug: 'cascos', icon: '⛑️', description: 'Cascos de protección' },
    { name: 'Arneses', slug: 'arneses', icon: '🪢', description: 'Arneses de escalada' },
    { name: 'Descensores', slug: 'descensores', icon: '🎿', description: 'Dispositivos de descenso' },
    { name: 'Poleas', slug: 'poleas', icon: '⚙️', description: 'Poleas y bloqueadores' },
    { name: 'Cintas', slug: 'cintas', icon: '➰', description: 'Cintas express y anillos' },
    { name: 'Anclajes', slug: 'anclajes', icon: '🔩', description: 'Anclajes y fijaciones' },
    { name: 'Pies de Gato', slug: 'pies-gato', icon: '👟', description: 'Calzado de escalada' },
    { name: 'Frontales', slug: 'frontales', icon: '🔦', description: 'Linternas frontales' },
    { name: 'Mapas', slug: 'mapas', icon: '🗺️', description: 'Mapas topográficos' },
]

// Marcas por categoría
export const BRANDS = {
    cuerdas: ['Petzl', 'Beal', 'Edelrid', 'Edelweiss', 'Tendon', 'Mammut'],
    mosquetones: ['Petzl', 'Black Diamond', 'DMM', 'Kong', 'Camp', 'Climbing Technology'],
    sacas: ['Petzl', 'Millet', 'Singing Rock', 'Rodcle', 'Camp'],
    cascos: ['Petzl', 'Black Diamond', 'Edelrid', 'Mammut', 'Climbing Technology'],
    arneses: ['Petzl', 'Black Diamond', 'Edelrid', 'Arc\'teryx', 'Mammut'],
    descensores: ['Petzl', 'Black Diamond', 'Edelrid', 'Climbing Technology'],
    poleas: ['Petzl', 'Climbing Technology', 'DMM', 'Kong'],
    cintas: ['Petzl', 'Black Diamond', 'DMM', 'Edelrid'],
    anclajes: ['Petzl', 'Fixe', 'Raumer', 'Climbing Technology'],
    'pies-gato': ['La Sportiva', 'Scarpa', 'Five Ten', 'Evolv', 'Boreal'],
    frontales: ['Petzl', 'Black Diamond', 'Fenix', 'Led Lenser'],
    mapas: ['IGN', 'Editorial Alpina', 'Prames'],
}

// Modelos comunes
export const MODELS = {
    cuerdas: ['Mambo', 'Joker', 'Swift', 'Static', 'Canyon', 'Parallel', 'Contact', 'Volta'],
    mosquetones: ['Attache', 'Roclock', 'Spirit', 'Vapor', 'Orbit', 'Gamma', 'Djinn'],
    arneses: ['Corax', 'Momentum', 'Solution', 'Adjama', 'Hirundos'],
    descensores: ['Grigri', 'ATC', 'Reverso', 'Otto', 'Stop'],
}

// Tipos de actividades para reservas
export const RESERVATION_PURPOSES = [
    'Curso de espeleología',
    'Salida a vía ferrata',
    'Expedición semanal',
    'Curso de iniciación',
    'Actividad de grupo',
    'Salida de fin de semana',
    'Curso de perfeccionamiento',
    'Actividad escolar',
    'Entrenamiento',
    'Competición',
]

// Estados de items
export const ITEM_STATUSES = ['available', 'in_use', 'maintenance', 'retired'] as const

// Estados de reservas
export const RESERVATION_STATUSES = [
    'pending',
    'approved',
    'delivered',
    'returned',
    'cancelled',
] as const
