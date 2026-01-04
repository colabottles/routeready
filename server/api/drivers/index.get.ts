import { sql } from '~/server/database/db'

export default defineEventHandler(async () => {
  try {
    const drivers = await sql`
      SELECT * FROM drivers
      ORDER BY created_at DESC
    `

    return {
      success: true,
      data: drivers
    }
  } catch (error) {
    console.error('Error fetching drivers:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch drivers'
    })
  }
})