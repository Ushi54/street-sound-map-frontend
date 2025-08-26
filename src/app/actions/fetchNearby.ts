export async function fetchNearby(lat: number, lon: number, radiusKm = 5) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/places/nearby?lat=${lat}&lon=${lon}&radiusKm=${radiusKm}`
  
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed: ${res.status}`)
  return res.json() as Promise<Array<{
    id: string; name: string; description: string; address: string; distanceKm: number
  }>>
}
