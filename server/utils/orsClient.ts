import { useRuntimeConfig } from '#imports'

export type Coordinate = [number, number] // [lon, lat]
export interface ORSDirectionsOptions {
  profile?: string
  optimize?: 'shortest' | 'fastest'
  units?: 'm' | 'km'
}

export async function getDirections(coordinates: Coordinate[], profile = 'driving-car') {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error('`coordinates` must be an array with at least two [lon, lat] pairs')
  }

  const config = useRuntimeConfig()
  const key = (config as any).orsApiKey as string
  if (!key) throw new Error('OpenRouteService API key is not configured (ORS_API_KEY or runtime config)')

  const url = `https://api.openrouteservice.org/v2/directions/${encodeURIComponent(profile)}/geojson`

  const body = {
    coordinates,
    // keep default options; can be extended later
    instructions: true,
    geometry: true
  }

  // use runtime $fetch (available in Nitro). Use globalThis to avoid ts errors in envs without auto-imports.
  const _fetch = (globalThis as any).$fetch || fetch

  const res = await _fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  // Basic validation
  if (!res || !res.features || res.features.length === 0) {
    throw new Error('No route found')
  }

  const feature = res.features[0]
  const summary = feature.properties?.summary || {}
  return {
    distance: summary.distance, // meters
    duration: summary.duration, // seconds
    geometry: feature.geometry,
    properties: feature.properties
  }
}
