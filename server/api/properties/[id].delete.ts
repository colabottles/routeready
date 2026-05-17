import { useSupabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseServer()

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true, message: 'Property deleted successfully' }
})