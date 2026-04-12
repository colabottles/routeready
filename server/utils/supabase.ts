import { createClient } from '@supabase/supabase-js'

export function useSupabaseServer() {
  const config = useRuntimeConfig()
  return createClient(
    config.public.supabaseUrl as string,
    config.supabaseServiceRoleKey as string
  )
}