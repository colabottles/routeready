import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invalid schedule ID'
      })
    }

    const [updatedSchedule] = await sql`
      UPDATE schedules
      SET
        driver_id = ${body.driver_id},
        date = ${body.date},
        shift_start = ${body.shift_start},
        shift_end = ${body.shift_end},
        route_assigned = ${body.route_assigned || null},
        vehicle_id = ${body.vehicle_id || null},
        status = ${body.status},
        notes = ${body.notes || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedSchedule) {
      throw createError({
        statusCode: 404,
        message: 'Schedule not found'
      })
    }

    return {
      success: true,
      data: updatedSchedule
    }
  } catch (error) {
    console.error('Error updating schedule:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw createError({
        statusCode: 409,
        message: 'Schedule conflict: driver already scheduled at this time'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to update schedule'
    })
  }
})