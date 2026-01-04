import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/routeready'

export const sql = postgres(connectionString)

export interface Driver {
  id: number
  name: string
  email: string
  phone: string
  license: string
  status: string
  current_route: string | null
  rating: string
  created_at: Date
  updated_at: Date
}