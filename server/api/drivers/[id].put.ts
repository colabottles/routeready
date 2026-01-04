import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')
    const body = await readBody(event)

    console.log('PUT request - ID:', id)
    console.log('PUT request - Body:', body)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invalid driver ID'
      })
    }

    // Update driver
    const [updatedDriver] = await sql`
      UPDATE drivers
      SET
        name = ${body.name},
        email = ${body.email},
        phone = ${body.phone},
        license = ${body.license},
        status = ${body.status},
        current_route = ${body.current_route || null},
        rating = ${body.rating || 0},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    console.log('Updated driver:', updatedDriver)

    if (!updatedDriver) {
      throw createError({
        statusCode: 404,
        message: 'Driver not found'
      })
    }

    return {
      success: true,
      data: updatedDriver
    }
  } catch (error) {
    console.error('Error updating driver:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw createError({
        statusCode: 409,
        message: 'Driver with this email or license already exists'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to update driver'
    })
  }
})