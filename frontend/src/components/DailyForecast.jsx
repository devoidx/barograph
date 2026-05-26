const WMO_ICONS = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',
  71:'🌨️',73:'🌨️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',
  95:'⛈️',96:'⛈️',99:'⛈️',
}

const WMO_DESC = {
  0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
  45:'Fog',48:'Icy fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
  61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',
  75:'Heavy snow',80:'Light showers',81:'Showers',82:'Heavy showers',
  95:'Thunderstorm',96:'Thunderstorm',99:'Thunderstorm',
}

function fmtDay(iso) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function DailyForecast({ daily }) {
  const allMax = daily.temperature_2m_max.filter(Boolean)
  const allMin = daily.temperature_2m_min.filter(Boolean)
  const rangeMin = Math.min(...allMin)
  const rangeMax = Math.max(...allMax)
  const span = rangeMax - rangeMin || 1

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
        7-day forecast
      </div>
      {daily.time.map((t, i) => {
        const barLeft = ((daily.temperature_2m_min[i] - rangeMin) / span) * 100
        const barWidth = ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / span) * 100
        return (
          <div key={t} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '7px 0',
            borderBottom: i < daily.time.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ fontSize: '13px', fontWeight: '500', minWidth: '90px' }}>
              {fmtDay(t)}
            </div>
            <div style={{ fontSize: '18px', minWidth: '28px' }}>
              {WMO_ICONS[daily.weather_code[i]] || '🌡️'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '100px' }}>
              {WMO_DESC[daily.weather_code[i]] || ''}
            </div>
            {daily.precipitation_probability_max[i] > 5 && (
              <div style={{ fontSize: '11px', color: 'var(--accent-text)', minWidth: '36px' }}>
                💧{daily.precipitation_probability_max[i]}%
              </div>
            )}
            {daily.precipitation_probability_max[i] <= 5 && (
              <div style={{ minWidth: '36px' }} />
            )}
            <div style={{
              flex: 1,
              height: '4px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '2px',
              position: 'relative',
              minWidth: '80px',
            }}>
              <div style={{
                position: 'absolute',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'var(--accent)',
                left: `${barLeft.toFixed(1)}%`,
                width: `${Math.max(barWidth, 8).toFixed(1)}%`,
              }} />
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '13px', minWidth: '70px', justifyContent: 'flex-end' }}>
              <span style={{ fontWeight: '500' }}>{Math.round(daily.temperature_2m_max[i])}°</span>
              <span style={{ color: 'var(--text-secondary)' }}>{Math.round(daily.temperature_2m_min[i])}°</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
