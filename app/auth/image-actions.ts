'use server'

import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function uploadProofImage(userId: string, file: File, taskId: string) {
  try {
    if (!file) {
      return { error: 'No file provided' }
    }

    if (!file.type.startsWith('image/')) {
      return { error: 'File must be an image' }
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { error: 'Image must be less than 5MB' }
    }

    const supabase = await createClient()

    // Generate unique filename
    const fileName = `${userId}/${taskId}/${uuidv4()}-${Date.now()}`
    const filePath = `proof-images/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('proof-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('[v0] Upload error:', error)
      return { error: `Upload failed: ${error.message}` }
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('proof-images')
      .getPublicUrl(data.path)

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[v0] Image upload error:', error)
    return { error: error instanceof Error ? error.message : 'Upload failed' }
  }
}
