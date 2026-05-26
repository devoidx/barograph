function windDir(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

function beaufort(kmh) {
  const ms = kmh / 3.6
  if (ms < 0.3) return { n: 0, label: 'Calm' }
  if (ms < 1.6) return { n: 1, label: 'Light air' }
  if (ms < 3.4) return { n: 2, label: 'Light breeze' }
  if (ms < 5.5) return { n: 3, label: 'Gentle breeze' }
  if (ms < 8.0) return { n: 4, label: 'Moderate breeze' }
  if (ms < 10.8) return { n: 5, label: 'Fresh breeze' }
  if (ms < 13.9) return { n: 6, label: 'Strong breeze' }
  if (ms < 17.2) return { n: 7, label: 'Near gale' }
  if (ms < 20.8) return { n: 8, label: 'Gale' }
  if (ms < 24.5) return { n: 9, label: 'Severe gale' }
  if (ms < 28.5) return { n: 10, label: 'Storm' }
  if (ms < 32.7) return { n: 11, label: 'Violent storm' }
  return { n: 12, label: 'Hurricane' }
}

export default function WindPanel({ current }) {
  const dir = current.wind_direction_10m
  const speed = current.wind_speed_10m
  const gust = current.wind_gusts_10m
  const bf = beaufort(speed)

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
        Wind
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Compass */}
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '50%',
          border: '2px solid var(--border)',
          position: 'relative',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {['N','E','S','W'].map((d, i) => (
            <span key={d} style={{
              position: 'absolute',
              fontSize: '9px',
              fontWeight: '700',
              color: 'var(--text-hint)',
              top: i === 0 ? '4px' : i === 2 ? 'auto' : '50%',
              bottom: i === 2 ? '4px' : 'auto',
              left: i === 3 ? '4px' : i === 1 ? 'auto' : '50%',
              right: i === 1 ? '4px' : 'auto',
              transform: (i === 0 || i === 2) ? 'translateX(-50%)' : 'translateY(-50%)',
            }}>{d}</span>
          ))}
          {/* Needle */}
          <div style={{
            position: 'absolute',
            width: '3px',
            height: '28px',
            backgroundColor: 'var(--accent)',
            borderRadius: '2px',
            bottom: '50%',
            left: 'calc(50% - 1.5px)',
            transformOrigin: 'bottom center',
            transform: `rotate(${dir}deg)`,
          }} />
          <div style={{
            width: '7px', height: '7px',
            borderRadius: '50%',
            backgroundColor: 'var(--border-strong)',
            zIndex: 1,
          }} />
        </div>

        {/* Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Speed</span>
            <span style={{ fontWeight: '500' }}>{Math.round(speed)} km/h</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Gusts</span>
            <span style={{ fontWeight: '500' }}>{Math.round(gust)} km/h</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Direction</span>
            <span style={{ fontWeight: '500' }}>{windDir(dir)} · {dir}°</span>
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-hint)',
            paddingTop: '4px',
            borderTop: '1px solid var(--border)',
          }}>
            Beaufort {bf.n} — {bf.label}
          </div>
        </div>
      </div>
    </div>
  )
}
