export default function RadarMap({ location }) {
  const windyUrl = `https://embed.windy.com/embed2.html?lat=${location.lat}&lon=${location.lon}&detailLat=${location.lat}&detailLon=${location.lon}&width=650&height=450&zoom=9&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-hint)' }}>
            Radar · Wind · Satellite · Lightning — powered by Windy
          </span>
        </div>
      </div>
      <iframe
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
