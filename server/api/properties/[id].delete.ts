export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Property ID is required'
    })
  }

  // In a real app, delete from your database:

  // First, you might want to delete related records (service history, schedules, etc.)
  await event.context.db.query('DELETE FROM service_history WHERE property_id = ?', [id])
  await event.context.db.query('DELETE FROM schedules WHERE property_id = ?', [id])

  // Then delete the property
  const result = await event.context.db.query('DELETE FROM properties WHERE id = ?', [id])

  if (result.affectedRows === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Property not found'
    })
  }

  // Response for development
  return {
    success: true,
    message: 'Property deleted successfully'
  }
})