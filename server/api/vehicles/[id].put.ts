import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invalid vehicle ID'
      })
    }

    const [updatedVehicle] = await sql`
      UPDATE vehicles
      SET
        name = ${body.name},
        license_plate = ${body.license_plate || body.licensePlate},
        type = ${body.type},
        icon = ${body.icon},
        make = ${body.make},
        model = ${body.model},
        year = ${body.year},
        mileage = ${body.mileage},
        status = ${body.status},
        assigned_driver = ${body.assigned_driver || body.assignedDriver || null},
        next_service = ${body.next_service || body.nextService || null},
        service_due = ${body.service_due !== undefined ? body.service_due : body.serviceDue || false},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (!updatedVehicle) {
      throw createError({
        statusCode: 404,
        message: 'Vehicle not found'
      })
    }

    return {
      success: true,
      data: updatedVehicle
    }
  } catch (error) {
    console.error('Error updating vehicle:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw createError({
        statusCode: 409,
        message: 'Vehicle with this license plate already exists'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to update vehicle'
    })
  }
})