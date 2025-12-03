// Presentation Layer - Dynamic Metadata Fields Component
'use client'

import { CategoryMetadataSchema, CategoryMetadataField } from '../../domain/entities/Category'

interface DynamicMetadataFieldsProps {
    schema: CategoryMetadataSchema
    value: Record<string, any>
    onChange: (metadata: Record<string, any>) => void
    disabled?: boolean
}

export function DynamicMetadataFields({
    schema,
    value,
    onChange,
    disabled = false
}: DynamicMetadataFieldsProps) {
    if (!schema || !schema.properties || Object.keys(schema.properties).length === 0) {
        return null
    }

    const handleFieldChange = (fieldName: string, fieldValue: any) => {
        onChange({
            ...value,
            [fieldName]: fieldValue
        })
    }

    const renderField = (fieldName: string, field: CategoryMetadataField) => {
        const isRequired = schema.required?.includes(fieldName) || false
        const fieldValue = value[fieldName]

        // Number field
        if (field.type === 'number') {
            return (
                <div key={fieldName}>
                    <label htmlFor={fieldName} className="block text-sm font-semibold text-gray-900 mb-2">
                        {field.label || fieldName} {field.unit && `(${field.unit})`}
                        {isRequired && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                    <input
                        type="number"
                        id={fieldName}
                        value={fieldValue ?? ''}
                        onChange={(e) => handleFieldChange(fieldName, e.target.value ? parseFloat(e.target.value) : null)}
                        required={isRequired}
                        disabled={disabled}
                        min={field.minimum}
                        max={field.maximum}
                        step="any"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={field.label || fieldName}
                    />
                </div>
            )
        }

        // String field with enum (select)
        if (field.type === 'string' && field.enum) {
            return (
                <div key={fieldName}>
                    <label htmlFor={fieldName} className="block text-sm font-semibold text-gray-900 mb-2">
                        {field.label || fieldName}
                        {isRequired && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                    <select
                        id={fieldName}
                        value={fieldValue ?? ''}
                        onChange={(e) => handleFieldChange(fieldName, e.target.value || null)}
                        required={isRequired}
                        disabled={disabled}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-background)] text-[var(--color-foreground)]"
                    >
                        <option value="" className="bg-[var(--color-background)] text-[var(--color-foreground)]">Seleccionar...</option>
                        {field.enum.map((option) => (
                            <option key={option} value={option} className="bg-[var(--color-background)] text-[var(--color-foreground)]">
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            )
        }

        // String field (text input)
        if (field.type === 'string') {
            // Date field
            if (field.format === 'date') {
                return (
                    <div key={fieldName}>
                        <label htmlFor={fieldName} className="block text-sm font-semibold text-gray-900 mb-2">
                            {field.label || fieldName}
                            {isRequired && <span className="text-rose-500 ml-1">*</span>}
                        </label>
                        <input
                            type="date"
                            id={fieldName}
                            value={fieldValue ?? ''}
                            onChange={(e) => handleFieldChange(fieldName, e.target.value || null)}
                            required={isRequired}
                            disabled={disabled}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                )
            }

            // Regular text input
            return (
                <div key={fieldName}>
                    <label htmlFor={fieldName} className="block text-sm font-semibold text-gray-900 mb-2">
                        {field.label || fieldName}
                        {isRequired && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                    <input
                        type="text"
                        id={fieldName}
                        value={fieldValue ?? ''}
                        onChange={(e) => handleFieldChange(fieldName, e.target.value || null)}
                        required={isRequired}
                        disabled={disabled}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={field.label || fieldName}
                    />
                </div>
            )
        }

        // Boolean field (checkbox)
        if (field.type === 'boolean') {
            return (
                <div key={fieldName} className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id={fieldName}
                        checked={fieldValue ?? false}
                        onChange={(e) => handleFieldChange(fieldName, e.target.checked)}
                        disabled={disabled}
                        className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <label htmlFor={fieldName} className="text-sm font-medium text-gray-900">
                        {field.label || fieldName}
                        {isRequired && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                </div>
            )
        }

        // Array field (simple text input for now, could be enhanced)
        if (field.type === 'array') {
            return (
                <div key={fieldName}>
                    <label htmlFor={fieldName} className="block text-sm font-semibold text-gray-900 mb-2">
                        {field.label || fieldName} (separados por coma)
                        {isRequired && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                    <input
                        type="text"
                        id={fieldName}
                        value={Array.isArray(fieldValue) ? fieldValue.join(', ') : ''}
                        onChange={(e) => {
                            const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            handleFieldChange(fieldName, arr.length > 0 ? arr : null)
                        }}
                        required={isRequired}
                        disabled={disabled}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Ej: UIAA, CE"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Ingresa los valores separados por comas
                    </p>
                </div>
            )
        }

        return null
    }

    return (
        <div className="space-y-6">
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Características Específicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(schema.properties).map(([fieldName, field]) =>
                        renderField(fieldName, field)
                    )}
                </div>
            </div>
        </div>
    )
}
