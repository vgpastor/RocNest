'use client'

import { ClipboardCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components'

interface CreateReviewButtonProps {
    itemId: string
    itemName: string
    size?: 'sm' | 'md' | 'lg' | 'icon'
    variant?: 'outline' | 'ghost' | 'primary' | 'secondary' | 'destructive' | 'glow'
}

export default function CreateReviewButton({
    itemId,
    itemName,
    size = 'sm',
    variant = 'outline',
}: CreateReviewButtonProps) {
    const router = useRouter()
    const [creating, setCreating] = useState(false)

    const handleCreateReview = async () => {
        const priority = prompt(
            `Crear revisión para: ${itemName}\n\nSelecciona la prioridad:\n- low (Baja)\n- normal (Normal)\n- high (Alta)\n- urgent (Urgente)`,
            'normal'
        )

        if (!priority || !['low', 'normal', 'high', 'urgent'].includes(priority)) {
            if (priority !== null) {
                alert('Prioridad inválida')
            }
            return
        }

        const notes = prompt('Notas adicionales (opcional):')

        setCreating(true)
        try {
            const response = await fetch('/api/catalog/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId,
                    priority,
                    notes: notes || null,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Error al crear la revisión')
            }

            const review = await response.json()
            router.push(`/catalog/reviews/${review.id}`)
            router.refresh()
        } catch (error: any) {
            console.error('Error creating review:', error)
            alert(error.message || 'Error al crear la revisión')
        } finally {
            setCreating(false)
        }
    }

    return (
        <Button
            size={size}
            variant={variant}
            onClick={handleCreateReview}
            disabled={creating}
            title="Marcar para revisión"
        >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            {creating ? 'Creando...' : 'Revisar'}
        </Button>
    )
}
