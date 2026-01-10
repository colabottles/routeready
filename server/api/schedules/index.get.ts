import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const startDate = query.startDate as string
    const endDate = query.endDate as string
    const driverId = query.driverId ? parseInt(query.driverId as string) : null

    let schedules

    if (startDate && endDate) {
      if (driverId) {
        schedules = await sql`
          SELECT s.*, d.name as driver_name, v.name as vehicle_name
          FROM schedules s
          LEFT JOIN drivers d ON s.driver_id = d.id
          LEFT JOIN vehicles v ON s.vehicle_id = v.id
          WHERE s.date >= ${startDate}::date
          AND s.date <= ${endDate}::date
          AND s.driver_id = ${driverId}
          ORDER BY s.date ASC, s.shift_start ASC
        `
      } else {
        schedules = await sql`
          SELECT s.*, d.name as driver_name, v.name as vehicle_name
          FROM schedules s
          LEFT JOIN drivers d ON s.driver_id = d.id
          LEFT JOIN vehicles v ON s.vehicle_id = v.id
          WHERE s.date >= ${startDate}::date
          AND s.date <= ${endDate}::date
          ORDER BY s.date ASC, s.shift_start ASC
        `
      }
    } else {
      schedules = await sql`
        SELECT s.*, d.name as driver_name, v.name as vehicle_name
        FROM schedules s
        LEFT JOIN drivers d ON s.driver_id = d.id
        LEFT JOIN vehicles v ON s.vehicle_id = v.id
        ORDER BY s.date DESC, s.shift_start ASC
        LIMIT 100
      `
    }

    return {
      success: true,
      data: schedules
    }
  } catch (error) {
    console.error('Error fetching schedules:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch schedules'
    })
  }
})