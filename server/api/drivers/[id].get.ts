import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id

    if (!id) {
      throw createError({ statusCode: 400, message: 'Invalid driver ID' })
    }

    const [driver] = await sql`
      SELECT * FROM drivers WHERE id = ${id}
    `

    if (!driver) {
      throw createError({ statusCode: 404, message: 'Driver not found' })
    }

    return { success: true, data: driver }
  } catch (error) {
    console.error('Error fetching driver:', error)
    throw createError({ statusCode: 500, message: 'Failed to fetch driver' })
  }
})