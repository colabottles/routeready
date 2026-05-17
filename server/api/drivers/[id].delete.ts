import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id

    if (!id) {
      throw createError({ statusCode: 400, message: 'Invalid driver ID' })
    }

    const [deletedDriver] = await sql`
      DELETE FROM drivers
      WHERE id = ${id}
      RETURNING *
    `

    if (!deletedDriver) {
      throw createError({ statusCode: 404, message: 'Driver not found' })
    }

    return { success: true, data: deletedDriver }
  } catch (error) {
    console.error('Error deleting driver:', error)
    throw createError({ statusCode: 500, message: 'Failed to delete driver' })
  }
})