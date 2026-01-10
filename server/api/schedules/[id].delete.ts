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

    const [deletedSchedule] = await sql`
      DELETE FROM schedules
      WHERE id = ${id}
      RETURNING *
    `

    if (!deletedSchedule) {
      throw createError({
        statusCode: 404,
        message: 'Schedule not found'
      })
    }

    return {
      success: true,
      data: deletedSchedule
    }
  } catch (error) {
    console.error('Error deleting schedule:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete schedule'
    })
  }
})