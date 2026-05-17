export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { lat, lng } = query

  if (!lat || !lng) {
    throw createError({ statusCode: 400, message: 'lat and lng required' })
  }

  const apiKey = process.env.ORS_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'ORS_API_KEY not set' })
  }

  const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lng}&point.lat=${lat}&size=1`

  const response = await fetch(url)

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Reverse geocode failed' })
  }

  const data = await response.json()
  const feature = data.features?.[0]
  const address = feature?.properties?.label ?? `${lat}, ${lng}`

  return { address }
})