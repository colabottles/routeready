import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.driver_id || !body.date || !body.shift_start || !body.shift_end) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: driver_id, date, shift_start, shift_end'
      })
    }

    const [newSchedule] = await sql`
      INSERT INTO schedules (
        driver_id, date, shift_start, shift_end,
        route_assigned, vehicle_id, status, notes
      )
      VALUES (
        ${body.driver_id},
        ${body.date},
        ${body.shift_start},
        ${body.shift_end},
        ${body.route_assigned || null},
        ${body.vehicle_id || null},
        ${body.status || 'scheduled'},
        ${body.notes || null}
      )
      RETURNING *
    `

    return {
      success: true,
      data: newSchedule
    }
  } catch (error) {
    console.error('Error creating schedule:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw createError({
        statusCode: 409,
        message: 'Schedule already exists for this driver at this time'
      })
    }

    if (error && typeof error === 'object' && 'code' in error && error.code === '23503') {
      throw createError({
        statusCode: 400,
        message: 'Invalid driver_id or vehicle_id'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to create schedule'
    })
  }
})