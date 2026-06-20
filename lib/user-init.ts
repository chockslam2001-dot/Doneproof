import { createClient } from '@/lib/supabase/client'

// Default starter routine for all new users - completely empty checklist
export const DEFAULT_CHECKLIST = {
  id: 'r1',
  name: "Today's Checklist",
  iconKey: 'checkbox',
  accent: 'sky',
  time: 'Anytime',
  repeat: 'Daily',
  critical: false,
  tasks: [],
}

export function getInitialDataForUser() {
  // All new users get clean data - only Today's Checklist
  return {
    routines: [DEFAULT_CHECKLIST],
    vault: [],
    trusted: [],
    timeline: [],
  }
}
