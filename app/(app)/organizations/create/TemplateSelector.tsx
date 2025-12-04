'use client'

import { CheckCircle2 } from 'lucide-react'
import { TEMPLATE_METADATA, type TemplateType } from '@/prisma/seeds/shared/templates'

interface TemplateSelectorProps {
    selected: TemplateType
    onChange: (template: TemplateType) => void
    disabled?: boolean
}

export function TemplateSelector({ selected, onChange, disabled }: TemplateSelectorProps) {
    const templates = Object.values(TEMPLATE_METADATA)

    return (
        <div className="space-y-3">
            {templates.map((template) => {
                const isSelected = selected === template.id

                return (
                    <button
                        key={template.id}
                        type="button"
                        onClick={() => onChange(template.id as TemplateType)}
                        disabled={disabled}
                        className={`
                            w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                            ${isSelected
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                : 'border-[var(--color-input)] hover:border-[var(--color-primary)]/50'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        <div className="flex items-start gap-3">
                            {/* Icon & Selection Indicator */}
                            <div className="flex items-center gap-2">
                                <div className="text-3xl">{template.icon}</div>
                                {isSelected && (
                                    <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)]" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="font-semibold text-base mb-1">
                                    {template.name}
                                </div>
                                <p className="text-sm text-[var(--color-muted-foreground)] mb-2">
                                    {template.description}
                                </p>

                                {/* Includes List */}
                                {template.includes.length > 0 && (
                                    <ul className="space-y-1">
                                        {template.includes.map((item, index) => (
                                            <li
                                                key={index}
                                                className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1"
                                            >
                                                <span className="text-[var(--color-success)]">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Estimated Time */}
                                <div className="mt-2 text-xs text-[var(--color-muted-foreground)] italic">
                                    Tiempo estimado: {template.estimatedTime}
                                </div>
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
