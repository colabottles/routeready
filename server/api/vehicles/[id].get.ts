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

    const [vehicle] = await sql`
      SELECT * FROM vehicles WHERE id = ${id}
    `

    if (!vehicle) {
      throw createError({
        statusCode: 404,
        message: 'Vehicle not found'
      })
    }

    return {
      success: true,
      data: vehicle
    }
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch vehicle'
    })
  }
})