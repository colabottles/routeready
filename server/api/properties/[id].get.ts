import { useSupabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseServer()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw createError({ statusCode: 404, statusMessage: error.message })
  return { data }
})