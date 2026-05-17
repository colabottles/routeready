export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { address } = query

  if (!address) {
    throw createError({ statusCode: 400, message: 'address required' })
  }

  const apiKey = process.env.ORS_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'ORS_API_KEY not set' })
  }

  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address as string)}&size=1`

  const response = await fetch(url)

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Geocode failed' })
  }

  const data = await response.json()
  const feature = data.features?.[0]

  if (!feature) {
    throw createError({ statusCode: 404, message: 'Address not found' })
  }

  const [lng, lat] = feature.geometry.coordinates
  const label = feature.properties.label

  return { lat, lng, label }
})