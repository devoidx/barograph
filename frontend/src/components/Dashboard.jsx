import { useQuery } from '@tanstack/react-query'
import { fetchCurrent } from '../api/weather'
import CurrentConditions from './CurrentConditions'

export default function Dashboard({ location }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['current', location.lat, location.lon],
    queryFn: () => fetchCurrent(location.lat, location.lon),
  })

  if (isLoading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem',
      color: 'var(--text-hint)',
      fontSize: '14px',
      gap: '10px',
    }}>
      <div style={{
        width: '18px', height: '18px',
        border: '2px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      Fetching weather data...
    </div>
  )

  if (error) return (
    <div style={{
      padding: '1rem',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      color: 'var(--danger)',
      fontSize: '13px',
    }}>
      Failed to load weather data. Please try again.
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CurrentConditions
        forecast={data.forecast}
        airQuality={data.air_quality}
        locationName={location.name}
      />
    </div>
  )
}
