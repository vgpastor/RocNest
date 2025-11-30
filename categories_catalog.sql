-- =====================================================
-- COMPREHENSIVE CATEGORY CATALOG FOR MOUNTAIN SPORTS
-- Categorías para escalada, espeleología, barranquismo, montaña
-- =====================================================

-- Categorías de Material de Montaña
INSERT INTO categories (name, slug, description, icon, requires_unique_numbering, can_be_composite, can_be_subdivided, metadata_schema) VALUES

-- ========== CUERDAS Y CORDINOS ==========
('Cuerdas Dinámicas', 'cuerdas-dinamicas', 'Cuerdas dinámicas para escalada', 'Cable', true, false, true, '{
  "type": "object",
  "properties": {
    "length": {"type": "number", "minimum": 0, "unit": "m", "label": "Longitud"},
    "diameter": {"type": "number", "minimum": 0, "maximum": 15, "unit": "mm", "label": "Diámetro"},
    "ropeType": {"type": "string", "enum": ["simple", "half", "twin"], "label": "Tipo de cuerda"},
    "treatment": {"type": "string", "enum": ["dry", "non-dry"], "label": "Tratamiento"},
    "certifications": {"type": "array", "items": {"type": "string"}, "label": "Certificaciones"},
    "manufactureDate": {"type": "string", "format": "date", "label": "Fecha de fabricación"},
    "firstUseDate": {"type": "string", "format": "date", "label": "Primera puesta en uso"},
    "lastInspection": {"type": "string", "format": "date", "label": "Última revisión"},
    "fallCount": {"type": "number", "minimum": 0, "label": "Número de caídas registradas"}
  },
  "required": ["length", "diameter", "ropeType"]
}'),

('Cuerdas Estáticas', 'cuerdas-estaticas', 'Cuerdas estáticas para espeleología y trabajos verticales', 'Cable', true, false, true, '{
  "type": "object",
  "properties": {
    "length": {"type": "number", "minimum": 0, "unit": "m", "label": "Longitud"},
    "diameter": {"type": "number", "minimum": 0, "maximum": 15, "unit": "mm", "label": "Diámetro"},
    "elongation": {"type": "number", "minimum": 0, "maximum": 10, "unit": "%", "label": "Elongación"},
    "treatment": {"type": "string", "enum": ["dry", "non-dry"], "label": "Tratamiento"},
    "certifications": {"type": "array", "items": {"type": "string"}, "label": "Certificaciones"},
    "manufactureDate": {"type": "string", "format": "date", "label": "Fecha de fabricación"},
    "lastInspection": {"type": "string", "format": "date", "label": "Última revisión"}
  },
  "required": ["length", "diameter"]
}'),

('Cordinos', 'cordinos', 'Cordinos y anillos de cinta', 'Link2', true, false, true, '{
  "type": "object",
  "properties": {
    "length": {"type": "number", "minimum": 0, "unit": "cm", "label": "Longitud"},
    "diameter": {"type": "number", "minimum": 0, "maximum": 10, "unit": "mm", "label": "Diámetro"},
    "material": {"type": "string", "enum": ["nylon", "dyneema", "kevlar"], "label": "Material"},
    "strength": {"type": "number", "minimum": 0, "unit": "kN", "label": "Resistencia"},
    "type": {"type": "string", "enum": ["loop", "cord"], "label": "Tipo"}
  },
  "required": ["length", "diameter", "material"]
}'),

('Cintas Express', 'cintas-express', 'Cintas planas y anillos de cinta', 'Minus', true, false, true, '{
  "type": "object",
  "properties": {
    "length": {"type": "number", "minimum": 0, "unit": "cm", "label": "Longitud"},
    "width": {"type": "number", "minimum": 0, "unit": "mm", "label": "Ancho"},
    "material": {"type": "string", "enum": ["nylon", "dyneema"], "label": "Material"},
    "strength": {"type": "number", "minimum": 0, "unit": "kN", "label": "Resistencia"},
    "type": {"type": "string", "enum": ["tubular", "flat", "loop"], "label": "Tipo"}
  },
  "required": ["length", "width", "material"]
}'),

-- ========== MOSQUETONES Y CONECTORES ==========
('Mosquetones', 'mosquetones', 'Mosquetones de seguridad', 'Link', true, false, false, '{
  "type": "object",
  "properties": {
    "material": {"type": "string", "enum": ["aluminum", "steel"], "label": "Material"},
    "gateType": {"type": "string", "enum": ["screw", "auto", "straight", "wire"], "label": "Tipo de cierre"},
    "shape": {"type": "string", "enum": ["HMS", "D", "oval", "asymmetric"], "label": "Forma"},
    "strengthClosed": {"type": "number", "minimum": 0, "unit": "kN", "label": "Resistencia eje mayor"},
    "strengthOpen": {"type": "number", "minimum": 0, "unit": "kN", "label": "Resistencia puerta abierta"},
    "strengthMinor": {"type": "number", "minimum": 0, "unit": "kN", "label": "Resistencia eje menor"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "gateOpening": {"type": "number", "minimum": 0, "unit": "mm", "label": "Apertura de puerta"}
  },
  "required": ["material", "gateType", "shape", "strengthClosed"]
}'),

('Maillones', 'maillones', 'Maillones y conectores rápidos', 'Link', true, false, false, '{
  "type": "object",
  "properties": {
    "material": {"type": "string", "enum": ["steel", "aluminum"], "label": "Material"},
    "shape": {"type": "string", "enum": ["oval", "delta", "pear"], "label": "Forma"},
    "strength": {"type": "number", "minimum": 0, "unit": "kN", "label": "Resistencia"},
    "diameter": {"type": "number", "minimum": 0, "unit": "mm", "label": "Diámetro"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"}
  },
  "required": ["material", "shape", "strength"]
}'),

-- ========== ARNESES ==========
('Arneses Escalada', 'arneses-escalada', 'Arneses de escalada deportiva y alpinismo', 'User', true, false, false, '{
  "type": "object",
  "properties": {
    "size": {"type": "string", "enum": ["XS", "S", "M", "L", "XL", "XXL"], "label": "Talla"},
    "type": {"type": "string", "enum": ["sport", "alpine", "big-wall", "via-ferrata"], "label": "Tipo"},
    "gearLoops": {"type": "number", "minimum": 0, "label": "Número de portamateriales"},
    "adjustable": {"type": "boolean", "label": "Ajustable"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "certifications": {"type": "array", "items": {"type": "string"}, "label": "Certificaciones"}
  },
  "required": ["size", "type"]
}'),

('Arneses Espeleología', 'arneses-espeleologia', 'Arneses para espeleología y barranquismo', 'User', true, false, false, '{
  "type": "object",
  "properties": {
    "size": {"type": "string", "enum": ["XS", "S", "M", "L", "XL", "XXL"], "label": "Talla"},
    "type": {"type": "string", "enum": ["sit", "full-body", "chest"], "label": "Tipo"},
    "material": {"type": "string", "enum": ["nylon", "polyester"], "label": "Material"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"}
  },
  "required": ["size", "type"]
}'),

-- ========== CASCOS ==========
('Cascos', 'cascos', 'Cascos de protección', 'HardHat', true, false, false, '{
  "type": "object",
  "properties": {
    "size": {"type": "string", "enum": ["S", "M", "L", "S/M", "M/L", "adjustable"], "label": "Talla"},
    "type": {"type": "string", "enum": ["foam", "hardshell", "hybrid"], "label": "Tipo de construcción"},
    "activity": {"type": "string", "enum": ["climbing", "caving", "mountaineering", "multi"], "label": "Actividad"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "ventilation": {"type": "boolean", "label": "Ventilación"},
    "headlampClips": {"type": "boolean", "label": "Clips para frontal"},
    "certifications": {"type": "array", "items": {"type": "string"}, "label": "Certificaciones"}
  },
  "required": ["size", "type", "activity"]
}'),

-- ========== DISPOSITIVOS DE ASEGURAMIENTO ==========
('Aseguradores', 'aseguradores', 'Dispositivos de aseguramiento', 'Shield', true, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["tube", "assisted-braking", "auto-lock", "figure-8"], "label": "Tipo"},
    "ropeCompatibility": {"type": "array", "items": {"type": "string"}, "label": "Compatibilidad cuerdas"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "certifications": {"type": "array", "items": {"type": "string"}, "label": "Certificaciones"}
  },
  "required": ["type"]
}'),

('Descensores', 'descensores', 'Dispositivos de descenso', 'ArrowDown', true, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["rack", "figure-8", "tube", "auto-stop"], "label": "Tipo"},
    "ropeCompatibility": {"type": "array", "items": {"type": "string"}, "label": "Compatibilidad cuerdas"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "material": {"type": "string", "enum": ["aluminum", "steel"], "label": "Material"}
  },
  "required": ["type"]
}'),

('Bloqueadores', 'bloqueadores', 'Bloqueadores y puños de ascenso', 'ArrowUp', true, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["handled", "chest", "foot", "rope-clamp"], "label": "Tipo"},
    "hand": {"type": "string", "enum": ["left", "right", "both"], "label": "Mano"},
    "ropeCompatibility": {"type": "array", "items": {"type": "string"}, "label": "Compatibilidad cuerdas"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"}
  },
  "required": ["type"]
}'),

-- ========== ANCLAJES ==========
('Tornillos de Hielo', 'tornillos-hielo', 'Tornillos para hielo', 'Snowflake', true, false, false, '{
  "type": "object",
  "properties": {
    "length": {"type": "number", "minimum": 0, "unit": "cm", "label": "Longitud"},
    "material": {"type": "string", "enum": ["steel", "titanium"], "label": "Material"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "type": {"type": "string", "enum": ["tubular", "solid"], "label": "Tipo"}
  },
  "required": ["length", "material"]
}'),

('Friends y Fisureros', 'friends-fisureros', 'Dispositivos de anclaje en fisuras', 'Grip', true, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["cam", "nut", "hex", "tricam"], "label": "Tipo"},
    "size": {"type": "string", "label": "Talla/Número"},
    "rangeMin": {"type": "number", "minimum": 0, "unit": "mm", "label": "Rango mínimo"},
    "rangeMax": {"type": "number", "minimum": 0, "unit": "mm", "label": "Rango máximo"},
    "strength": {"type": "number", "minimum": 0, "unit": "kN", "label": "Resistencia"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"}
  },
  "required": ["type", "size"]
}'),

('Clavos y Pitones', 'clavos-pitones', 'Clavos y pitones de anclaje', 'Hammer', true, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["blade", "angle", "lost-arrow", "bong"], "label": "Tipo"},
    "length": {"type": "number", "minimum": 0, "unit": "mm", "label": "Longitud"},
    "material": {"type": "string", "enum": ["steel", "chrome-moly"], "label": "Material"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"}
  },
  "required": ["type", "length"]
}'),

-- ========== POLEAS Y SISTEMAS ==========
('Poleas', 'poleas', 'Poleas y roldanas', 'Circle', true, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["simple", "double", "triple", "tandem"], "label": "Tipo"},
    "diameter": {"type": "number", "minimum": 0, "unit": "mm", "label": "Diámetro polea"},
    "efficiency": {"type": "number", "minimum": 0, "maximum": 100, "unit": "%", "label": "Eficiencia"},
    "ropeCompatibility": {"type": "array", "items": {"type": "string"}, "label": "Compatibilidad cuerdas"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "workingLoad": {"type": "number", "minimum": 0, "unit": "kN", "label": "Carga de trabajo"}
  },
  "required": ["type", "diameter"]
}'),

-- ========== MATERIAL DE PROGRESIÓN ==========
('Crampones', 'crampones', 'Crampones para hielo y nieve', 'Mountain', true, false, false, '{
  "type": "object",
  "properties": {
    "points": {"type": "number", "minimum": 0, "label": "Número de puntas"},
    "type": {"type": "string", "enum": ["strap-on", "hybrid", "step-in"], "label": "Sistema de fijación"},
    "material": {"type": "string", "enum": ["steel", "aluminum"], "label": "Material"},
    "frontPoints": {"type": "string", "enum": ["horizontal", "vertical", "dual"], "label": "Puntas delanteras"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso (par)"},
    "certifications": {"type": "array", "items": {"type": "string"}, "label": "Certificaciones"}
  },
  "required": ["points", "type"]
}'),

('Piolets', 'piolets', 'Piolets técnicos y de marcha', 'Axe', true, false, false, '{
  "type": "object",
  "properties": {
    "length": {"type": "number", "minimum": 0, "unit": "cm", "label": "Longitud"},
    "type": {"type": "string", "enum": ["walking", "technical", "ice-tool"], "label": "Tipo"},
    "shaft": {"type": "string", "enum": ["straight", "curved"], "label": "Mango"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "certifications": {"type": "array", "items": {"type": "string"}, "label": "Certificaciones"}
  },
  "required": ["length", "type"]
}'),

-- ========== ILUMINACIÓN ==========
('Frontales', 'frontales', 'Linternas frontales', 'Lightbulb', true, false, false, '{
  "type": "object",
  "properties": {
    "lumens": {"type": "number", "minimum": 0, "unit": "lm", "label": "Potencia lumínica"},
    "batteryType": {"type": "string", "enum": ["AAA", "AA", "rechargeable", "hybrid"], "label": "Tipo de batería"},
    "autonomy": {"type": "number", "minimum": 0, "unit": "h", "label": "Autonomía"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "waterproof": {"type": "string", "enum": ["IPX0", "IPX4", "IPX6", "IPX7", "IPX8"], "label": "Resistencia al agua"}
  },
  "required": ["lumens", "batteryType"]
}'),

-- ========== MOCHILAS Y TRANSPORTE ==========
('Mochilas', 'mochilas', 'Mochilas de montaña', 'Backpack', true, false, false, '{
  "type": "object",
  "properties": {
    "capacity": {"type": "number", "minimum": 0, "unit": "L", "label": "Capacidad"},
    "type": {"type": "string", "enum": ["daypack", "alpine", "expedition", "crag"], "label": "Tipo"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "frameType": {"type": "string", "enum": ["frameless", "internal", "external"], "label": "Tipo de estructura"},
    "waterproof": {"type": "boolean", "label": "Impermeable"}
  },
  "required": ["capacity", "type"]
}'),

('Bolsas de Cuerda', 'bolsas-cuerda', 'Bolsas para transporte de cuerdas', 'Package', true, false, false, '{
  "type": "object",
  "properties": {
    "capacity": {"type": "number", "minimum": 0, "unit": "L", "label": "Capacidad"},
    "ropeLength": {"type": "number", "minimum": 0, "unit": "m", "label": "Longitud cuerda máxima"},
    "waterproof": {"type": "boolean", "label": "Impermeable"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"}
  },
  "required": ["capacity"]
}'),

-- ========== PROTECCIÓN ==========
('Guantes', 'guantes', 'Guantes técnicos', 'Hand', true, false, false, '{
  "type": "object",
  "properties": {
    "size": {"type": "string", "enum": ["XS", "S", "M", "L", "XL"], "label": "Talla"},
    "type": {"type": "string", "enum": ["belay", "approach", "alpine", "ice"], "label": "Tipo"},
    "material": {"type": "string", "label": "Material"},
    "waterproof": {"type": "boolean", "label": "Impermeable"},
    "insulated": {"type": "boolean", "label": "Aislante"}
  },
  "required": ["size", "type"]
}'),

('Rodilleras', 'rodilleras', 'Rodilleras para espeleología', 'Shield', true, false, false, '{
  "type": "object",
  "properties": {
    "size": {"type": "string", "enum": ["S", "M", "L", "XL"], "label": "Talla"},
    "material": {"type": "string", "enum": ["neoprene", "cordura", "kevlar"], "label": "Material"},
    "thickness": {"type": "number", "minimum": 0, "unit": "mm", "label": "Grosor"}
  },
  "required": ["size", "material"]
}'),

-- ========== BARRANQUISMO ==========
('Neoprenos', 'neoprenos', 'Trajes de neopreno para barranquismo', 'Waves', true, false, false, '{
  "type": "object",
  "properties": {
    "size": {"type": "string", "enum": ["XS", "S", "M", "L", "XL", "XXL"], "label": "Talla"},
    "thickness": {"type": "number", "minimum": 0, "unit": "mm", "label": "Grosor"},
    "type": {"type": "string", "enum": ["full", "shorty", "long-john", "jacket"], "label": "Tipo"},
    "reinforced": {"type": "boolean", "label": "Reforzado"}
  },
  "required": ["size", "thickness", "type"]
}'),

('Bidones Estancos', 'bidones-estancos', 'Bidones y bolsas estancas', 'Container', true, false, false, '{
  "type": "object",
  "properties": {
    "capacity": {"type": "number", "minimum": 0, "unit": "L", "label": "Capacidad"},
    "type": {"type": "string", "enum": ["barrel", "dry-bag", "box"], "label": "Tipo"},
    "waterproofRating": {"type": "string", "enum": ["IPX6", "IPX7", "IPX8"], "label": "Nivel estanqueidad"}
  },
  "required": ["capacity", "type"]
}'),

-- ========== CAMPING Y VIVAC ==========
('Tiendas', 'tiendas', 'Tiendas de campaña', 'Tent', true, false, false, '{
  "type": "object",
  "properties": {
    "capacity": {"type": "number", "minimum": 1, "label": "Capacidad (personas)"},
    "seasons": {"type": "number", "minimum": 1, "maximum": 4, "label": "Estaciones"},
    "weight": {"type": "number", "minimum": 0, "unit": "kg", "label": "Peso"},
    "type": {"type": "string", "enum": ["tunnel", "dome", "geodesic", "single-wall"], "label": "Tipo"},
    "waterproofRating": {"type": "number", "minimum": 0, "unit": "mm", "label": "Columna de agua"}
  },
  "required": ["capacity", "seasons"]
}'),

('Sacos de Dormir', 'sacos-dormir', 'Sacos de dormir', 'Moon', true, false, false, '{
  "type": "object",
  "properties": {
    "temperature": {"type": "number", "unit": "°C", "label": "Temperatura confort"},
    "insulation": {"type": "string", "enum": ["down", "synthetic"], "label": "Aislamiento"},
    "shape": {"type": "string", "enum": ["mummy", "rectangular", "semi-rectangular"], "label": "Forma"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "length": {"type": "string", "enum": ["regular", "long"], "label": "Longitud"}
  },
  "required": ["temperature", "insulation"]
}'),

('Esterillas', 'esterillas', 'Esterillas y colchonetas', 'RectangleHorizontal', true, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["foam", "self-inflating", "air"], "label": "Tipo"},
    "rValue": {"type": "number", "minimum": 0, "label": "Valor R (aislamiento)"},
    "thickness": {"type": "number", "minimum": 0, "unit": "cm", "label": "Grosor"},
    "weight": {"type": "number", "minimum": 0, "unit": "g", "label": "Peso"},
    "length": {"type": "number", "minimum": 0, "unit": "cm", "label": "Longitud"}
  },
  "required": ["type", "rValue"]
}'),

-- ========== VARIOS ==========
('Magnesio', 'magnesio', 'Bolsas de magnesio y magnesio', 'Package', false, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["chalk-bag", "chalk-ball", "loose-chalk", "liquid-chalk"], "label": "Tipo"},
    "capacity": {"type": "number", "minimum": 0, "unit": "g", "label": "Capacidad"},
    "refillable": {"type": "boolean", "label": "Recargable"}
  },
  "required": ["type"]
}'),

('Kits de Primeros Auxilios', 'kits-primeros-auxilios', 'Botiquines y kits de primeros auxilios', 'Cross', false, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["personal", "group", "expedition"], "label": "Tipo"},
    "capacity": {"type": "number", "minimum": 1, "label": "Capacidad (personas)"},
    "waterproof": {"type": "boolean", "label": "Impermeable"}
  },
  "required": ["type"]
}'),

('Material Didáctico', 'material-didactico', 'Material para formación y cursos', 'BookOpen', false, false, false, '{
  "type": "object",
  "properties": {
    "type": {"type": "string", "enum": ["manual", "video", "model", "poster"], "label": "Tipo"},
    "topic": {"type": "string", "label": "Tema"},
    "language": {"type": "string", "enum": ["es", "en", "fr", "de"], "label": "Idioma"}
  },
  "required": ["type", "topic"]
}');
