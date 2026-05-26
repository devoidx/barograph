import { useQuery } from '@tanstack/react-query'
import { fetchRecords } from '../api/weather'

function Record({ icon, label, value, date }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: '16px', minWidth: '24px' }}>{icon}</span>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: '500' }}>{value}</span>
      {date && (
        <span style={{ fontSize: '11px', color: 'var(--text-hint)', minWidth: '80px', textAlign: 'right' }}>
          {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      )}
    </div>
  )
}

export default function RecordsPanel({ location }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['records', location.lat, location.lon],
    queryFn: () => fetchRecords(location.lat, location.lon),
    staleTime: 24 * 60 * 60 * 1000,
  })

  if (isLoading) return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
        Records (last 5 years)
      </div>
      <div style={{ color: 'var(--text-hint)', fontSize: '13px', padding: '1rem 0' }}>Loading...</div>
    </div>
  )

  if (error || !data) return null

  const r = data
  const records = [
    { icon: '🌡️', label: 'Highest temperature', record: r.highest_temp, fmt: v => `${v}°C` },
    { icon: '🥶', label: 'Lowest temperature', record: r.lowest_temp, fmt: v => `${v}°C` },
    { icon: '🌧️', label: 'Wettest day', record: r.most_rain_day, fmt: v => `${v} mm` },
    { icon: '💨', label: 'Strongest wind', record: r.max_wind_speed, fmt: v => `${v} km/h` },
    { icon: '🌪️', label: 'Strongest gust', record: r.max_gust, fmt: v => `${v} km/h` },
    { icon: '🔆', label: 'Highest UV', record: r.max_uv, fmt: v => `${v}` },
    { icon: '☀️', label: 'Most sunshine', record: r.most_sunshine, fmt: v => `${(v / 3600).toFixed(1)} hrs` },
  ].filter(item => item.record.value !== null)

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
        Records (last 5 years)
      </div>
      {records.map((item, i) => (
        <div key={item.label} style={{ borderBottom: i < records.length - 1 ? '' : 'none' }}>
          <Record
            icon={item.icon}
            label={item.label}
            value={item.fmt(item.record.value)}
            date={item.record.date}
          />
        </div>
      ))}
    </div>
  )
}
