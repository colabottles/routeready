import { sql } from '~/server/database/db'

export default defineEventHandler(async () => {
  try {
    const vehicles = await sql`
      SELECT * FROM vehicles
      ORDER BY created_at DESC
    `

    return {
      success: true,
      data: vehicles
    }
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch vehicles'
    })
  }
})