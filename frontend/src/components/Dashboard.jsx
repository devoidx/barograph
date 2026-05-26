import { useQuery } from '@tanstack/react-query'
import { fetchCurrent } from '../api/weather'
import CurrentConditions from './CurrentConditions'
import HourlyForecast from './HourlyForecast'
import DailyForecast from './DailyForecast'
import WindPanel from './WindPanel'
import UVPanel from './UVPanel'
import SolarPanel from './SolarPanel'
import PollenPanel from './PollenPanel'
import RainfallChart from './RainfallChart'
import RecordsPanel from './RecordsPanel'
import MonthlyStats from './MonthlyStats'
import RadarMap from './RadarMap'

function Spinner() {
  return (
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
}

export default function Dashboard({ location }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['current', location.lat, location.lon],
    queryFn: () => fetchCurrent(location.lat, location.lon),
  })

  if (isLoading) return <Spinner />

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

  const { forecast, air_quality } = data

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CurrentConditions
        forecast={forecast}
        airQuality={air_quality}
        locationName={location.name}
      />
      <HourlyForecast hourly={forecast.hourly} />
      <DailyForecast daily={forecast.daily} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <WindPanel current={forecast.current} />
        <UVPanel
          current={forecast.current}
          dailyMaxUV={forecast.daily.uv_index_max?.[0]}
        />
        <SolarPanel daily={forecast.daily} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <PollenPanel airQuality={air_quality} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <MonthlyStats location={location} />
          <RecordsPanel location={location} />
        </div>
      </div>
      <RadarMap location={location} />
      <RainfallChart location={location} />
    </div>
  )
}
