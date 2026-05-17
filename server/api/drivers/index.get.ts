import { sql } from '~/server/database/db'

export default defineEventHandler(async () => {
  const drivers = await sql`
    SELECT id, name, email, phone, license, status, rating, current_route_id
    FROM drivers
    ORDER BY name
  `
  console.log('First driver id:', drivers[0]?.id, typeof drivers[0]?.id)
  return { data: drivers }
})