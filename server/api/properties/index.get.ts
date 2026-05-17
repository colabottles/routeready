import { useSupabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabaseServer()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})