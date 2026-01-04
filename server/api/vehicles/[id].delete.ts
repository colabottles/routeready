import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invalid vehicle ID'
      })
    }

    const [deletedVehicle] = await sql`
      DELETE FROM vehicles
      WHERE id = ${id}
      RETURNING *
    `

    if (!deletedVehicle) {
      throw createError({
        statusCode: 404,
        message: 'Vehicle not found'
      })
    }

    return {
      success: true,
      data: deletedVehicle
    }
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete vehicle'
    })
  }
})