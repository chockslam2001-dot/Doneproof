'use server'

import { createClient } from '@/lib/supabase/server'

export async function loadUserData(userId: string, userEmail: string) {
  try {
    // Validate inputs
    if (!userId || !userEmail) {
      console.warn('[v0] Invalid user data: missing userId or userEmail')
      return {
        routines: [],
        vault: [],
        timeline: [],
        trusted: [],
      }
    }

    // Load user data from database
    const supabase = await createClient()

    const [routines, vaultItems, timelineItems, trustedTasks] = await Promise.all([
      supabase.from('user_routines').select('*').eq('user_id', userId),
      supabase.from('user_vault_items').select('*').eq('user_id', userId),
      supabase.from('user_timeline_items').select('*').eq('user_id', userId),
      supabase.from('user_trusted_tasks').select('*').eq('user_id', userId),
    ])

    console.log('[v0] Loaded user data from database')

    return {
      routines: routines.data || [],
      vault: vaultItems.data || [],
      timeline: timelineItems.data || [],
      trusted: trustedTasks.data || [],
    }
  } catch (error) {
    console.error('[v0] Error loading user data:', error instanceof Error ? error.message : String(error))
    // Return empty data structure on error
    return {
      routines: [],
      vault: [],
      timeline: [],
      trusted: [],
    }
  }
}

export async function saveRoutine(routine: any) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { error } = await supabase.from('user_routines').upsert(
      {
        id: routine.id,
        user_id: user.id,
        name: routine.name,
        icon_key: routine.iconKey,
        accent: routine.accent,
        time_field: routine.time,
        repeat: routine.repeat,
        critical: routine.critical,
        tasks: routine.tasks || [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,id' }
    )

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error saving routine:', error)
    return { error: 'Failed to save routine' }
  }
}

export async function deleteRoutine(routineId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { error } = await supabase
      .from('user_routines')
      .delete()
      .eq('id', routineId)
      .eq('user_id', user.id)

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting routine:', error)
    return { error: 'Failed to delete routine' }
  }
}

export async function saveVaultItem(item: any) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { error } = await supabase.from('user_vault_items').upsert(
      {
        id: item.id,
        user_id: user.id,
        title: item.title,
        body: item.body,
        category: item.category,
        type: item.type,
        date: item.date,
      },
      { onConflict: 'id' }
    )

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error saving vault item:', error)
    return { error: 'Failed to save vault item' }
  }
}

export async function deleteVaultItem(itemId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { error } = await supabase
      .from('user_vault_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting vault item:', error)
    return { error: 'Failed to delete vault item' }
  }
}

export async function saveTimelineItem(item: any) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { error } = await supabase.from('user_timeline_items').upsert(
      {
        id: item.id,
        user_id: user.id,
        group_name: item.groupName,
        task: item.task,
        routine: item.routine,
        time_field: item.time,
        type: item.type,
        note: item.note,
        tag: item.tag,
      },
      { onConflict: 'id' }
    )

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error saving timeline item:', error)
    return { error: 'Failed to save timeline item' }
  }
}

export async function deleteTimelineItem(itemId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { error } = await supabase
      .from('user_timeline_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting timeline item:', error)
    return { error: 'Failed to delete timeline item' }
  }
}

export async function saveTrustedTask(task: any) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { error } = await supabase.from('user_trusted_tasks').upsert(
      {
        id: task.id,
        user_id: user.id,
        label: task.label,
        from_user: task.from,
        done: task.done,
      },
      { onConflict: 'id' }
    )

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error saving trusted task:', error)
    return { error: 'Failed to save trusted task' }
  }
}

export async function deleteTrustedTask(taskId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { error } = await supabase
      .from('user_trusted_tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id)

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting trusted task:', error)
    return { error: 'Failed to delete trusted task' }
  }
}
