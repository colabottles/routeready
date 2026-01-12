export type Coordinate = [number, number] // [lon, lat]

export async function fetchDirections(coordinates: Coordinate[], profile = 'driving-car') {
  const res = await $fetch('/api/directions', {
    method: 'POST',
    body: { coordinates, profile }
  })
  return res
}
