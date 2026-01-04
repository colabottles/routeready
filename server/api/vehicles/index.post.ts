import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.name || !body.licensePlate || !body.type || !body.make || !body.model || !body.year || body.mileage === undefined) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    const [newVehicle] = await sql`
      INSERT INTO vehicles (
        name, license_plate, type, icon, make, model, year,
        mileage, status, assigned_driver, next_service, service_due
      )
      VALUES (
        ${body.name},
        ${body.licensePlate},
        ${body.type},
        ${body.icon || '🚗'},
        ${body.make},
        ${body.model},
        ${body.year},
        ${body.mileage},
        ${body.status || 'active'},
        ${body.assignedDriver || null},
        ${body.nextService || null},
        ${body.serviceDue || false}
      )
      RETURNING *
    `

    return {
      success: true,
      data: newVehicle
    }
  } catch (error) {
    console.error('Error creating vehicle:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw createError({
        statusCode: 409,
        message: 'Vehicle with this license plate already exists'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to create vehicle'
    })
  }
})