const WMO_ICONS = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',
  71:'🌨️',73:'🌨️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',
  95:'⛈️',96:'⛈️',99:'⛈️',
}

function fmtHour(iso) {
  const d = new Date(iso)
  const now = new Date()
  if (
    d.getHours() === now.getHours() &&
    d.toDateString() === now.toDateString()
  ) return 'Now'
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function HourlyForecast({ hourly }) {
  const now = new Date()
  const startIdx = hourly.time.findIndex(t => new Date(t) >= now)
  const idx = startIdx === -1 ? 0 : startIdx
  const slice = {
    time: hourly.time.slice(idx, idx + 24),
    temp: hourly.temperature_2m.slice(idx, idx + 24),
    code: hourly.weather_code.slice(idx, idx + 24),
    precip_prob: hourly.precipitation_probability.slice(idx, idx + 24),
    wind: hourly.wind_speed_10m.slice(idx, idx + 24),
  }

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
        marginBottom: '12px',
      }}>
        Next 24 hours
      </div>
      <div style={{
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
        paddingBottom: '4px',
      }}>
        {slice.time.map((t, i) => (
          <div key={t} style={{
            flex: '0 0 60px',
            textAlign: 'center',
            padding: '8px 4px',
            borderRadius: '8px',
            backgroundColor: i === 0 ? 'var(--bg-secondary)' : 'transparent',
            border: i === 0 ? '1px solid var(--border)' : '1px solid transparent',
          }}>
            <div style={{ fontSize: '10px', color: 'var(--text-hint)' }}>
              {fmtHour(t)}
            </div>
            <div style={{ fontSize: '20px', margin: '4px 0' }}>
              {WMO_ICONS[slice.code[i]] || '🌡️'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500' }}>
              {Math.round(slice.temp[i])}°
            </div>
            <div style={{ fontSize: '10px', color: 'var(--accent-text)', marginTop: '2px' }}>
              {slice.precip_prob[i] > 5 ? `${slice.precip_prob[i]}%` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
