export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { stops } = body

  if (!stops || stops.length < 2) {
    throw createError({ statusCode: 400, message: 'At least 2 stops required' })
  }

  const apiKey = process.env.ORS_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'ORS_API_KEY not set' })
  }

  // Build Vroom jobs — one per stop
  const jobs = stops.map((stop: { id: number; lat: number; lng: number }, index: number) => ({
    id: index + 1,
    location: [stop.lng, stop.lat],
  }))

  // Single vehicle starting and ending at first stop
  const vehicles = [
    {
      id: 1,
      profile: 'driving-car',
      start: [stops[0].lng, stops[0].lat],
      end: [stops[0].lng, stops[0].lat],
    },
  ]

  const response = await fetch('https://api.openrouteservice.org/optimization', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobs, vehicles }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw createError({ statusCode: response.status, message: `ORS error: ${error}` })
  }

  const data = await response.json()

  // Extract ordered stop indices from Vroom response
  const steps = data.routes?.[0]?.steps ?? []
  const orderedIds = steps
    .filter((s: { type: string }) => s.type === 'job')
    .map((s: { job: number }) => s.job - 1) // convert back to 0-based index

  // Build ordered coordinates for the route line (actual road geometry)
  const orderedCoords = orderedIds.map((i: number) => [stops[i].lng, stops[i].lat])

  // Fetch road geometry via ORS Directions
  const directionsResponse = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ coordinates: orderedCoords }),
  })

  let geometry = null
  if (directionsResponse.ok) {
    const directionsData = await directionsResponse.json()
    geometry = directionsData.features?.[0]?.geometry ?? null
  }

  return {
    orderedIndices: orderedIds,
    geometry,
  }
})