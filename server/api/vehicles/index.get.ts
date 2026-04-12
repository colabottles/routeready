import { sql } from '~/server/database/db'

export default defineEventHandler(async () => {
  const vehicles = await sql`
    SELECT id, name, make, model, year, license_plate, status, assigned_driver_id
    FROM vehicles
    ORDER BY name
  `
  return { data: vehicles }
})