import { useSupabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name || !body.type || !body.address || !body.size || !body.frequency || !body.priority) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const supabase = useSupabaseServer()
  const { data, error } = await supabase
    .from('properties')
    .insert({
      name: body.name,
      address: body.address,
      type: body.type,
      size: body.size,
      frequency: body.frequency,
      priority: body.priority,
      status: body.status || 'active',
      contact_name: body.contactName || null,
      contact_phone: body.contactPhone || null,
      contact_email: body.contactEmail || null,
      access_instructions: body.accessInstructions || null,
      special_requirements: body.specialRequirements || null,
      preferred_time: body.preferredTime || null,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true, data }
})