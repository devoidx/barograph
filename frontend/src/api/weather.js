const BASE = '/api/v1'

export async function fetchCurrent(lat, lon) {
  const res = await fetch(`${BASE}/weather/current?lat=${lat}&lon=${lon}`)
  if (!res.ok) throw new Error('Failed to fetch weather')
  return res.json()
}

export async function fetchHistoricalMonthly(lat, lon, year, month) {
  const res = await fetch(
    `${BASE}/historical/monthly?lat=${lat}&lon=${lon}&year=${year}&month=${month}`
  )
  if (!res.ok) throw new Error('Failed to fetch monthly data')
  return res.json()
}

export async function fetchRainfallYears(lat, lon, years = 10) {
  const res = await fetch(
    `${BASE}/historical/rainfall-years?lat=${lat}&lon=${lon}&years=${years}`
  )
  if (!res.ok) throw new Error('Failed to fetch rainfall data')
  return res.json()
}

export async function fetchRecords(lat, lon) {
  const res = await fetch(`${BASE}/records/alltime?lat=${lat}&lon=${lon}`)
  if (!res.ok) throw new Error('Failed to fetch records')
  return res.json()
}

export async function geocode(query) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  )
  if (!res.ok) throw new Error('Geocoding failed')
  return res.json()
}
