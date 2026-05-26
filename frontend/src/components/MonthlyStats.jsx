import { useQuery } from '@tanstack/react-query'
import { fetchHistoricalMonthly } from '../api/weather'

export default function MonthlyStats({ location }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const { data, isLoading, error } = useQuery({
    queryKey: ['monthly', location.lat, location.lon, year, month],
    queryFn: () => fetchHistoricalMonthly(location.lat, location.lon, year, month),
    staleTime: 60 * 60 * 1000,
  })

  const monthName = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  if (isLoading) return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
        {monthName} so far
      </div>
      <div style={{ color: 'var(--text-hint)', fontSize: '13px', padding: '1rem 0' }}>Loading...</div>
    </div>
  )

  if (error || !data) return null

  const stats = [
    { icon: '🌡️', label: 'Highest temp', value: data.temp_max != null ? `${data.temp_max}°C` : '—' },
    { icon: '🥶', label: 'Lowest temp', value: data.temp_min != null ? `${data.temp_min}°C` : '—' },
    { icon: '📊', label: 'Mean temp', value: data.temp_mean != null ? `${data.temp_mean}°C` : '—' },
    { icon: '🌧️', label: 'Total rainfall', value: data.rainfall_total_mm != null ? `${data.rainfall_total_mm} mm` : '—' },
    { icon: '☀️', label: 'Sunshine hours', value: data.sunshine_hours != null ? `${data.sunshine_hours} hrs` : '—' },
    { icon: '🔆', label: 'Max UV', value: data.uv_max != null ? `${data.uv_max}` : '—' },
    { icon: '💨', label: 'Max wind', value: data.wind_max_kmh != null ? `${data.wind_max_kmh} km/h` : '—' },
    { icon: '🌱', label: 'Total ET', value: data.et_total_mm != null ? `${data.et_total_mm} mm` : '—' },
  ]

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
    }}>
      <div style={{
        fontSize: '11px',
        color: 'var(--text-hint)',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '8px',
      }}>
        {monthName} so far
      </div>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 0',
          borderBottom: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <span style={{ fontSize: '14px', minWidth: '22px' }}>{s.icon}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>{s.label}</span>
          <span style={{ fontSize: '13px', fontWeight: '500' }}>{s.value}</span>
        </div>
      ))}
    </div>
  )
}
