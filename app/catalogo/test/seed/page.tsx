import { createClient } from '@/lib/supabase/server'

export default async function SeedPage() {
    const supabase = await createClient()

    const categories = [
        {
            name: 'Cuerdas Dinámicas',
            slug: 'cuerdas-dinamicas',
            description: 'Cuerdas dinámicas para escalada',
            icon: 'Cable',
            requires_unique_numbering: true,
            can_be_composite: false,
            can_be_subdivided: true,
            metadata_schema: {
                type: "object",
                properties: {
                    length: { type: "number", minimum: 0, unit: "m", label: "Longitud" },
                    diameter: { type: "number", minimum: 0, maximum: 15, unit: "mm", label: "Diámetro" },
                    ropeType: { type: "string", enum: ["simple", "half", "twin"], label: "Tipo de cuerda" },
                    treatment: { type: "string", enum: ["dry", "non-dry"], label: "Tratamiento" },
                    certifications: { type: "array", items: { type: "string" }, label: "Certificaciones" },
                    manufactureDate: { type: "string", format: "date", label: "Fecha de fabricación" },
                    firstUseDate: { type: "string", format: "date", label: "Primera puesta en uso" },
                    lastInspection: { type: "string", format: "date", label: "Última revisión" },
                    fallCount: { type: "number", minimum: 0, label: "Número de caídas registradas" }
                },
                required: ["length", "diameter", "ropeType"]
            }
        },
        {
            name: 'Mosquetones',
            slug: 'mosquetones',
            description: 'Mosquetones de seguridad',
            icon: 'Link',
            requires_unique_numbering: true,
            can_be_composite: false,
            can_be_subdivided: false,
            metadata_schema: {
                type: "object",
                properties: {
                    material: { type: "string", enum: ["aluminum", "steel"], label: "Material" },
                    gateType: { type: "string", enum: ["screw", "auto", "straight", "wire"], label: "Tipo de cierre" },
                    shape: { type: "string", enum: ["HMS", "D", "oval", "asymmetric"], label: "Forma" },
                    strengthClosed: { type: "number", minimum: 0, unit: "kN", label: "Resistencia eje mayor" },
                    strengthOpen: { type: "number", minimum: 0, unit: "kN", label: "Resistencia puerta abierta" },
                    strengthMinor: { type: "number", minimum: 0, unit: "kN", label: "Resistencia eje menor" },
                    weight: { type: "number", minimum: 0, unit: "g", label: "Peso" },
                    gateOpening: { type: "number", minimum: 0, unit: "mm", label: "Apertura de puerta" }
                },
                required: ["material", "gateType", "shape", "strengthClosed"]
            }
        }
    ]

    const { data, error } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' }).select()

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Seeding Categories</h1>
            {error ? (
                <div className="text-red-500">Error: {JSON.stringify(error)}</div>
            ) : (
                <div className="text-green-500">
                    Success! Inserted {data?.length} categories.
                    <pre className="bg-gray-100 p-2 rounded mt-2 text-black">{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
