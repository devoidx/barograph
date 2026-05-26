export default function RadarMap({ location }) {
  const { lat, lon } = location
  const params = new URLSearchParams({
    lat: lat.toFixed(4),
    lon: lon.toFixed(4),
    detailLat: lat.toFixed(4),
    detailLon: lon.toFixed(4),
    zoom: '9',
    level: 'surface',
    overlay: 'rain',
    product: 'ecmwf',
    message: 'true',
    marker: 'true',
    pressure: 'true',
    type: 'map',
    metricWind: 'km/h',
    metricTemp: '°C',
  })

  const windyUrl = `https://embed.windy.com/embed2.html?${params.toString()}`

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-hint)',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
        }}>
          Weather Map
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text-hint)' }}>
          Radar · Wind · Satellite · Lightning — powered by Windy
        </span>
      </div>
      <iframe
        key={`${lat}-${lon}`}
        src={windyUrl}
        style={{
          width: '100%',
          height: '450px',
          border: 'none',
          display: 'block',
        }}
        title="Weather map"
        allowFullScreen
      />
    </div>
  )
}
