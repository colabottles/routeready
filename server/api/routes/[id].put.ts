import { sql } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, message: 'Invalid route ID' })

  const [updated] = await sql`
    UPDATE routes SET
      name         = ${body.name},
      status       = ${body.status},
      driver_id    = ${body.driver_id || null},
      vehicle_id   = ${body.vehicle_id || null},
      updated_at   = NOW()
    WHERE id = ${id}
    RETURNING *
  `

  if (!updated) throw createError({ statusCode: 404, message: 'Route not found' })
  return { data: updated }
})