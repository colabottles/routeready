import { getDirections, Coordinate } from '~/server/utils/orsClient'
import type { ORSDirectionsResult } from '~/types/ors'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Accept either `coordinates: [[lon,lat],[lon,lat],...]` or `origin` + `destination`
    let coordinates = body?.coordinates as Coordinate[] | undefined
    if (!coordinates && body?.origin && body?.destination) {
      coordinates = [body.origin, body.destination]
    }

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      throw createError({ statusCode: 400, message: 'Invalid coordinates. Expect array of at least two [lon,lat] pairs or origin/destination properties.' })
    }

    const isValid = coordinates.every((c: any) => Array.isArray(c) && c.length === 2 && typeof c[0] === 'number' && typeof c[1] === 'number')
    if (!isValid) {
      throw createError({ statusCode: 400, message: 'Each coordinate must be a numeric [lon, lat] pair.' })
    }

    const profile = body?.profile || 'driving-car'

    const result: ORSDirectionsResult = await getDirections(coordinates, profile)

    return {
      success: true,
      data: result
    }
  } catch (err: any) {
    console.error('Error fetching directions:', err)
    const status = err?.statusCode || err?.status || 500
    throw createError({ statusCode: status, message: err?.message || 'Failed to fetch directions' })
  }
})
