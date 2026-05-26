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

  if (error) return null

  const r = data

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
      <Record
        icon="🌡️"
        label="Highest temperature"
        value={r.highest_temp.value != null ? `${r.highest_temp.value}°C` : '—'}
        date={r.highest_temp.date}
      />
      <Record
        icon="🥶"
        label="Lowest temperature"
        value={r.lowest_temp.value != null ? `${r.lowest_temp.value}°C` : '—'}
        date={r.lowest_temp.date}
      />
      <Record
        icon="🌧️"
        label="Wettest day"
        value={r.most_rain_day.value != null ? `${r.most_rain_day.value} mm` : '—'}
        date={r.most_rain_day.date}
      />
      <Record
        icon="💨"
        label="Strongest wind"
        value={r.max_wind_speed.value != null ? `${r.max_wind_speed.value} km/h` : '—'}
        date={r.max_wind_speed.date}
      />
      <Record
        icon="🌪️"
        label="Strongest gust"
        value={r.max_gust.value != null ? `${r.max_gust.value} km/h` : '—'}
        date={r.max_gust.date}
      />
      <Record
        icon="🔆"
        label="Highest UV"
        value={r.max_uv.value != null ? `${r.max_uv.value}` : '—'}
        date={r.max_uv.date}
      />
      <div style={{ borderBottom: 'none' }}>
        <Record
          icon="☀️"
          label="Most sunshine"
          value={r.most_sunshine.value != null ? `${(r.most_sunshine.value / 3600).toFixed(1)} hrs` : '—'}
          date={r.most_sunshine.date}
        />
      </div>
    </div>
  )
}
