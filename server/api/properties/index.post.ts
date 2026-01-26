// server/api/properties/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { getDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    if (!body.name || !body.type || !body.address || !body.size || !body.frequency || !body.priority) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    const db = getDb()

    const query = `
      INSERT INTO properties (
        name, address, type, size, icon,
        frequency, priority, start_date, preferred_time,
        contact_name, contact_phone, contact_email,
        access_instructions, special_requirements, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `

    const values = [
      body.name,
      body.address,
      body.type,
      body.size,
      body.icon || '🏢',
      body.frequency,
      body.priority || 'normal',
      body.startDate || null,
      body.preferredTime || null,
      body.contactName || null,
      body.contactPhone || null,
      body.contactEmail || null,
      body.accessInstructions || null,
      body.specialRequirements || null,
      body.status || 'active'
    ]

    const result = await db.query(query, values)

    return {
      success: true,
      data: result.rows[0]
    }

  } catch (error) {
    console.error('Error creating property:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to create property'
    })
  }
})