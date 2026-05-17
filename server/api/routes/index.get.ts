import { sql } from '~/server/database/db'

export default defineEventHandler(async () => {
  const routes = await sql`
    SELECT r.*, d.name AS driver_name, v.name AS vehicle_name
    FROM routes r
    LEFT JOIN drivers d ON r.driver_id = d.id
    LEFT JOIN vehicles v ON r.vehicle_id = v.id
    ORDER BY r.created_at DESC
  `
  return { data: routes }
})