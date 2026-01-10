import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invalid schedule ID'
      })
    }

    const [schedule] = await sql`
      SELECT s.*, d.name as driver_name, v.name as vehicle_name
      FROM schedules s
      LEFT JOIN drivers d ON s.driver_id = d.id
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      WHERE s.id = ${id}
    `

    if (!schedule) {
      throw createError({
        statusCode: 404,
        message: 'Schedule not found'
      })
    }

    return {
      success: true,
      data: schedule
    }
  } catch (error) {
    console.error('Error fetching schedule:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch schedule'
    })
  }
})