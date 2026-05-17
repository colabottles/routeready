import { sql } from '~/server/database/db'

export default defineEventHandler(async () => {
  const now = new Date()
  const today = now.toISOString().split('T')[0] as string
  const weekStart = new Date(now)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0] as string

  const [driverRows, vehicleRows, routeRows, scheduleRows] = await Promise.all([
    sql`
      SELECT
        COUNT(*)                                   AS total,
        COUNT(*) FILTER (WHERE status = 'active')  AS active
      FROM drivers
    `,
    sql`
      SELECT
        COUNT(*)                                   AS total,
        COUNT(*) FILTER (WHERE status = 'active')  AS active
      FROM vehicles
    `,
    sql`
      SELECT
        COUNT(*)                                        AS total,
        COUNT(*) FILTER (WHERE status = 'active')       AS active,
        COUNT(*) FILTER (WHERE status = 'completed')    AS completed
      FROM routes
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE date = ${today}::date)           AS today,
        COUNT(*) FILTER (WHERE date >= ${weekStartStr}::date)   AS this_week
      FROM schedules
    `,
  ])

  const driverStats = driverRows[0] ?? { total: 0, active: 0 }
  const vehicleStats = vehicleRows[0] ?? { total: 0, active: 0 }
  const routeStats = routeRows[0] ?? { total: 0, active: 0, completed: 0 }
  const scheduleStats = scheduleRows[0] ?? { today: 0, this_week: 0 }

  const totalVehicles = Number(vehicleStats.total)
  const activeVehicles = Number(vehicleStats.active)
  const totalRoutes = Number(routeStats.total)
  const completedRoutes = Number(routeStats.completed)
  const activeRoutes = Number(routeStats.active)

  const vehicleUtilization = totalVehicles
    ? Math.round((activeVehicles / totalVehicles) * 100)
    : 0

  const completionBase = completedRoutes + activeRoutes
  const completionRate = completionBase
    ? Math.round((completedRoutes / completionBase) * 1000) / 10
    : 0

  return {
    totalDrivers: Number(driverStats.total),
    activeDrivers: Number(driverStats.active),
    totalVehicles,
    activeVehicles,
    vehicleUtilization,
    totalRoutes,
    activeRoutes,
    completionRate,
    todaySchedules: Number(scheduleStats.today),
    weekSchedules: Number(scheduleStats.this_week),
  }
})