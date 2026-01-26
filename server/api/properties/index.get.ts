// server/api/properties/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    const db = getDb()

    const query = `
      SELECT
        id, name, address, type, size, icon,
        frequency, priority, status,
        last_service_date, next_service_date,
        contact_name, contact_phone, contact_email,
        access_instructions, special_requirements,
        created_at, updated_at
      FROM properties
      ORDER BY created_at DESC
    `

    const result = await db.query(query)

    return {
      success: true,
      data: result.rows
    }

  } catch (error) {
    console.error('Error fetching properties:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to fetch properties'
    })
  }
})