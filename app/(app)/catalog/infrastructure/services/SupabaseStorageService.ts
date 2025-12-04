// Infrastructure Layer - Storage Service

import { createAdminClient } from '@/lib/supabase/admin'

import { IStorageService } from '../../application/use-cases/CreateItemUseCase'

export class SupabaseStorageService implements IStorageService {
    private bucketName = 'item-images'

    async uploadImage(file: File, identifier: string): Promise<string> {
        const supabase = createAdminClient()

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${identifier}-${Date.now()}.${fileExt}`
        const filePath = fileName

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(this.bucketName)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
            })

        if (error) {
            console.error('Error uploading image:', error)
            throw new Error('Error al subir la imagen')
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filePath)

        return publicUrl
    }

    async deleteImage(url: string): Promise<void> {
        const supabase = createAdminClient()

        // Extract filename from URL
        const fileName = url.split('/').pop()
        if (!fileName) return

        const { error } = await supabase.storage
            .from(this.bucketName)
            .remove([fileName])

        if (error) {
            console.error('Error deleting image:', error)
            throw new Error('Error al eliminar la imagen')
        }
    }
}
