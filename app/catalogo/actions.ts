'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createItem(formData: FormData) {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'No autenticado' }
    }

    // Extract form data
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const category = formData.get('category') as string
    const identifier = formData.get('identifier') as string
    const status = formData.get('status') as string
    const imageFile = formData.get('image') as File | null

    // Validate required fields
    if (!name || !brand || !model || !category || !identifier) {
        return { success: false, error: 'Faltan campos requeridos' }
    }

    let image_url: string | null = null

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
        try {
            // Generate unique filename
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${identifier}-${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('item-images')
                .upload(filePath, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Error uploading image:', uploadError)
                return { success: false, error: 'Error al subir la imagen' }
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('item-images')
                .getPublicUrl(filePath)

            image_url = publicUrl
        } catch (error) {
            console.error('Error processing image:', error)
            return { success: false, error: 'Error al procesar la imagen' }
        }
    }

    // Insert item into database
    const { data, error } = await supabase
        .from('items')
        .insert({
            name,
            description: description || null,
            brand,
            model,
            category,
            identifier,
            status: status || 'available',
            image_url,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating item:', error)

        // If item creation failed but image was uploaded, delete the image
        if (image_url) {
            const fileName = image_url.split('/').pop()
            if (fileName) {
                await supabase.storage.from('item-images').remove([fileName])
            }
        }

        // Handle specific errors
        if (error.code === '23505') {
            return { success: false, error: 'El código identificador ya existe' }
        }
        if (error.code === '42501' || error.message.includes('policy')) {
            return { success: false, error: 'No tienes permisos para crear items' }
        }
        return { success: false, error: 'Error al crear el item' }
    }

    // Revalidate the catalog page to show the new item
    revalidatePath('/catalogo')

    return { success: true, data }
}
