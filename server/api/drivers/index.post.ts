import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.name || !body.email || !body.phone || !body.license) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: name, email, phone, license'
      })
    }

    const [newDriver] = await sql`
      INSERT INTO drivers (name, email, phone, license, status, rating)
      VALUES (
        ${body.name},
        ${body.email},
        ${body.phone},
        ${body.license},
        ${body.status || 'active'},
        ${body.rating || 0}
      )
      RETURNING *
    `

    return {
      success: true,
      data: newDriver
    }
  } catch (error) {
    console.error('Error creating driver:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw createError({
        statusCode: 409,
        message: 'A driver with this email or license already exists'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to create driver'
    })
  }
})